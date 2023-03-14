import { MikroORM, QueryOrder } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { uniq } from 'lodash';
import isEmpty from 'lodash/isEmpty';
import { NotFoundError } from 'routing-controllers';
import { singleton } from 'tsyringe';
import { ConfigWrapper } from '../config';
import { Brand } from '../entities/brand';
import { Color } from '../entities/color';
import { Condition } from '../entities/condition';
import { Like } from '../entities/like';
import { Product } from '../entities/product';
import { TJWTTokenPayload, TProduct } from '../types';
import {
    TCreateProductDto,
    TGetBrandsDto,
    TGetProductsParamDto,
    TToggleProductLike,
} from '../types/dto/product';
import { TGetProductsResponse, TProductPreview } from '../types/response/products';
import { TCategoryAggregated } from '../types/services/product';
import { combineURLs, generateSlug, getAbsoluteThumbnails } from '../utils/helpers';
import { ElasticService } from './elastic/elastic';
import { ElasticProductDocument } from './elastic/types';
import { QueueService } from './queue';

@singleton()
export class ProductService {
    private productRepository;
    private config;
    constructor(
        private ormClient: MikroORM,
        { config }: ConfigWrapper,
        private elasticService: ElasticService,
        private queueService: QueueService,
    ) {
        this.config = config;
        this.productRepository = ormClient.em.getRepository(Product);
    }

    private _INSERT_LIKE_QUERY(userId: number, productId: number) {
        return `WITH i ("userId", "productId") AS (
                        VALUES (${userId}, ${productId})
                        )
                INSERT INTO "Like" ("userId", "productId")
                SELECT "userId",
                    "productId"
                FROM i
                WHERE NOT EXISTS (
                        SELECT 1
                        FROM "Like"
                        WHERE "userId" = i."userId"
                            AND "productId" = i."productId"
                    )
                RETURNING "id"
            `;
    }

    private _getLikedProducts(userId: number): Promise<TProductPreview[]> {
        const knex = (this.ormClient.em as EntityManager).getKnex();
        const query = knex('Like as l')
            .select(
                'p.id',
                'p.slug',
                'p.price',
                knex.raw(`(
                    SELECT i."thumbnails"
                    FROM "Image" AS i
                    WHERE p."id" = i."productId"
                    ORDER BY i."order"
                    LIMIT 1
                ) as thumbnails`),
            )
            .innerJoin('Product AS p', 'l.productId', 'p.id')
            .innerJoin('User AS u', 'l.userId', 'u.id')
            .where('u.id', userId)
            .andWhere('p.isDeleted', false)
            .andWhere('p.isApproved', true)
            .orderBy('l.id', 'desc')
            .toQuery();
        return this.ormClient.em.getConnection().execute(query);
    }

    private _getProductBySlug(slug: string, watcherId?: number) {
        let qb = (this.ormClient.em as EntityManager)
            .createQueryBuilder(Product, 'p')
            .select(['p.id', 'p.description', 'p.slug', 'p.currency', 'p.price', 'p.createdAt'])
            .addSelect('i.images')
            .addSelect("COALESCE(pc.colors, json '[]') as colors")
            .addSelect(
                `
                (
                    SELECT COALESCE(COUNT(*), 0)::INT
                    FROM "Like" AS l
                    WHERE l."productId" = p."id"
                ) as likes
            `,
            )
            .addSelect('row_to_json(c) as category')
            .addSelect('row_to_json(cn) as condition')
            .addSelect('row_to_json(u) as "seller"').addSelect(`
                (
                    CASE
                        WHEN b is null then null
                        ELSE row_to_json(b)
                    END
                ) as brand
            `).addSelect(`
                (
                    CASE
                        WHEN s is null then null
                        ELSE row_to_json(s)
                    END
                ) as size
            `).addSelect(`
                (
                    CASE
                        WHEN city is null then null
                        ELSE row_to_json(city)
                    END
                ) as city
            `);

        if (watcherId) {
            qb = qb.addSelect(`p."userId" = ${watcherId} as moderator`).addSelect(`
                EXISTS(
                        SELECT 1
                        FROM "Like" AS l
                        WHERE l."userId" = ${watcherId}
                            and l."productId" = p."id"
                ) as "isLiked"
            `);
        }

        const query = `
        ${qb.getQuery()}
            INNER JOIN LATERAL (
                SELECT json_agg(img) as images
                FROM "Image" AS img
                WHERE img."productId" = p."id"
                group by img.order
                ORDER BY img."order" ASC
            ) AS i ON TRUE
            INNER JOIN LATERAL (
                SELECT json_agg(color) as colors
                FROM "Color" AS color
                INNER JOIN "ProductColor" as pc ON pc."colorId" = color.id AND pc."productId" = p."id"
            ) AS pc ON TRUE
            INNER JOIN LATERAL (
                SELECT category.id,
                    category.name,
                    category.slug
                FROM "Category" AS category
                WHERE p."categoryId" = category."id"
                LIMIT 1
            ) as c ON true
            LEFT JOIN LATERAL (
                SELECT city.id,
                    city.name,
                    city.slug
                FROM "City" AS city
                WHERE p."cityId" = city."id"
                LIMIT 1
            ) as city ON true
            INNER JOIN LATERAL (
                SELECT condition.id,
                    condition.title,
                    condition.description
                FROM "Condition" AS condition
                WHERE p."conditionId" = condition."id"
                LIMIT 1
            ) as cn ON true
            INNER JOIN LATERAL (
                SELECT seller.id,
                    seller.name,
                    seller.username,
                    seller.avatar,
                    seller.phone,
                    seller."lastLoggedIn",
                    (
                        SELECT json_build_object(
                                'count',
                                COALESCE(count(*), 0)::int,
                                'rating',
                                COALESCE(AVG(r.rating), 0)::int
                            )
                        FROM "Rating" as r
                        WHERE seller."id" = r."userId"
                    ) as "rating",
                    (
                        SELECT COUNT(*)::int
                        FROM "Product" as p
                        WHERE seller."id" = p."userId"
                        AND p."isSold" = true
                        AND p."isDeleted" = false
                    ) as "productCount",
                    (
                        SELECT "name" 
                        FROM "City" as c
                        WHERE seller."cityId" = c."id"
                        LIMIT 1
                    ) as "location"
                FROM "User" AS seller
                WHERE p."userId" = seller."id"
                LIMIT 1
            ) as u ON true
            LEFT JOIN LATERAL (
                SELECT brand.id,
                    brand.name
                FROM "Brand" AS brand
                WHERE p."brandId" = brand."id"
                LIMIT 1
            ) as b ON true
            LEFT JOIN LATERAL (
                SELECT size.id,
                    size.title
                FROM "Size" AS size
                WHERE p."sizeId" = size."id"
                LIMIT 1
            ) as s ON true
            where p."slug"='${slug}';
        `;

        return this.ormClient.em
            .getConnection()
            .execute(query)
            .then((rows) => rows[0] || null);
    }

    private async _GET_PRODUCTS_QUERY(
        userId: number,
        { isLiked, isSelling, isSold, allItems, ...paginationFilter }: TGetProductsParamDto,
    ) {
        const knex = (this.ormClient.em as EntityManager).getKnex();

        let query = knex('Product as p').where('p.isDeleted', false);

        if (isLiked) {
            query = query
                .innerJoin('Like as l', 'l.productId', 'p.id')
                .innerJoin('User as u', 'l.userId', 'u.id')
                .andWhere('l.userId', userId);
        } else if (isSelling) {
            query = query
                .where('p.userId', userId)
                .andWhere('p.isSold', false)
                .andWhere('p.isActive', true)
                .andWhere('p.isApproved', true);
        } else if (isSold) {
            query = query.andWhere('p.userId', userId).andWhere('p.isSold', true);
        } else {
            query = query.andWhere('p.userId', userId);
        }

        const countQuery = query.clone().select(knex.raw('COUNT(*)::int')).toQuery();

        const productsQuery = query
            .select(
                knex.raw('distinct(p."id")'),
                'p.slug',
                'p.price',
                knex('Image as i')
                    .select('i.thumbnails')
                    .where('p.id', knex.raw('i."productId"'))
                    .orderBy('i.order')
                    .limit(1)
                    .as('thumbnails'),
            )
            .limit(paginationFilter.limit)
            .offset(paginationFilter.offset)
            .orderBy('p.id', 'desc')
            .toQuery();

        const count: number = await this.ormClient.em
            .getConnection()
            .execute(countQuery)
            .then((rows) => rows[0].count);

        const products: TProductPreview[] = await this.ormClient.em
            .getConnection()
            .execute(productsQuery);

        return { products, count };
    }

    getProductForEdit(slug: string) {
        const knex = (this.ormClient.em as EntityManager).getKnex();
        const query = knex('Product as p')
            .select(
                'id',
                'description',
                'price',
                'slug',
                'currency',
                knex.raw('row_to_json(c) as "category"'),
                knex.raw('row_to_json(cn) as "condition"'),
                knex.raw(`
                (
                    CASE
                        WHEN b is null then null
                        ELSE row_to_json(b)
                    END
                ) as "brand"
                `),
                knex.raw(`
                    (
                        CASE
                            WHEN s is null then null
                            ELSE row_to_json(s)
                        END
                    ) as "size"
                `),
            )
            .toQuery();

        return this.ormClient.em.getConnection().execute(query);
    }

    private get _GET_CATEGORY_CTE_WITH_SIZE_GROUPS_QUERY_() {
        const knex = (this.ormClient.em as EntityManager).getKnex();
        const query = this._GET_CATEGORY_CTE_QUERY_
            .with('maxlvl', (qb) => qb.select(knex.raw('max(lvl) as maxlvl')).from('category_cte'))
            .withRecursive('CATEGORY_TREE_CTE', (qb) =>
                qb
                    .select(
                        'c.*',
                        knex.raw("jsonb '[]' children"),
                        knex.raw(`
                            CASE
                                WHEN c."sizeGroupId" IS NOT NULL THEN ARRAY [c."sizeGroupId"]
                                ELSE '{}'::int []
                            END AS "sizeGroups"
                        `),
                    )
                    .from({ maxlvl: 'maxlvl', c: 'category_cte' })
                    .whereRaw('lvl = "maxlvl"')
                    .union(
                        (qb) =>
                            qb
                                .select(
                                    knex.raw('(branch_parent).*'),
                                    knex.raw('jsonb_agg(branch_child)'),
                                    knex.raw(`
                                        coalesce(
                                            array_agg(DISTINCT size_group_id) FILTER (
                                                WHERE size_group_id IS NOT NULL
                                            ),
                                            '{}'
                                        ) "sizeGroups"
                                    `),
                                )
                                .from(
                                    knex('category_cte as branch_parent')
                                        .select(
                                            'branch_parent',
                                            'branch_child',
                                            'branch_child.sizeGroupId as size_group_id',
                                        )
                                        .innerJoin(
                                            'CATEGORY_TREE_CTE as branch_child',
                                            'branch_child.parentId',
                                            'branch_parent.id',
                                        )
                                        .as('branch'),
                                )
                                .groupBy('branch.branch_parent')
                                .union((qb) =>
                                    qb
                                        .select(
                                            'c.*',
                                            knex.raw("jsonb '[]' children"),
                                            knex.raw(`
                                                CASE
                                                    WHEN c."sizeGroupId" IS NOT NULL THEN ARRAY [c."sizeGroupId"]
                                                    ELSE '{}'::int []
                                                END AS "sizeGroups"
                                            `),
                                        )
                                        .from('category_cte AS c')
                                        .whereNotExists(
                                            knex('category_cte AS hypothetical_child')
                                                .select(knex.raw('1'))
                                                .whereRaw('hypothetical_child."parentId" = c."id"'),
                                        ),
                                ),
                        true,
                    ),
            );
        return query;
    }

    private get _GET_CATEGORY_CTE_QUERY_() {
        const knex = (this.ormClient.em as EntityManager).getKnex();
        return knex.withRecursive('category_cte', (qb) => {
            qb.select('c.*', knex.raw('CONCAT(\'/\', c."slug") as "path"'), knex.raw('0 as lvl'))
                .from('Category AS c')
                .where('parentId', null)
                .unionAll((qb) =>
                    qb
                        .select(
                            'child.*',
                            knex.raw('CONCAT(parent."path", \'/\', child."slug") as "path"'),
                            knex.raw('parent.lvl + 1'),
                        )
                        .from('Category AS child')
                        .innerJoin('category_cte AS parent', 'child.parentId', 'parent.id'),
                );
        });
    }

    private _ELASTIC_PRODUCT_DOCUMENT_QUERY(productId: number, categoryId: number) {
        const knex = (this.ormClient.em as EntityManager).getKnex();

        return this._GET_CATEGORY_CTE_QUERY_
            .select(
                'id',
                'description',
                'price',
                'currency',
                'slug',
                'isActive',
                'isApproved',
                knex.raw('false as "sold"'),
                knex.raw(`
                    to_char (
                        "createdAt"::timestamp at time zone 'UTC',
                        'YYYY-MM-DD"T"HH24:MI:SS"Z"'
                    ) as "createdAt"
                `),
                knex.raw(`
                    to_char (
                        "updatedAt"::timestamp at time zone 'UTC',
                        'YYYY-MM-DD"T"HH24:MI:SS"Z"'
                    ) as "updatedAt"
                `),
                knex('User as u')
                    .select(knex.raw("json_build_object('id', u.id, 'username', u.username)"))
                    .where('u.id', knex.raw('p."userId"'))
                    .limit(1)
                    .as('user'),
                knex('Image as i')
                    .select(
                        knex.raw(`
                            COALESCE(
                                json_agg(
                                    json_build_object(
                                        'id',
                                        i.id,
                                        'original',
                                        i.original,
                                        'thumbnails',
                                        i.thumbnails
                                    )
                                    order by "i"."order"
                                ),
                                '[]'::json
                            )
                        `),
                    )
                    .where('i.productId', knex.raw('p."id"'))
                    .as('images'),
                knex('ProductColor as pc')
                    .select(
                        knex.raw(`
                            COALESCE(
                                json_agg(
                                    json_build_object(
                                        'id',
                                        c.id,
                                        'title',
                                        c.title,
                                        'hex',
                                        c.hex,
                                        'code',
                                        c.code
                                    )
                                ),
                                '[]'::json
                            )
                        `),
                    )
                    .innerJoin(
                        'Color as c',
                        knex.raw('c."id" = pc."colorId" AND pc."productId" = p."id"'),
                    )
                    .as('colors'),
                knex('Brand as b')
                    .select(knex.raw("json_build_object('id', b.id, 'name', b.name)"))
                    .where('b.id', knex.raw('p."brandId"'))
                    .as('brand'),
                knex('Condition as c')
                    .select(knex.raw("json_build_object('id', c.id, 'title', c.title)"))
                    .where('c.id', knex.raw('p."conditionId"'))
                    .as('condition'),
                knex('Size as s')
                    .select(knex.raw("json_build_object('id', s.id, 'title', s.title)"))
                    .where('s.id', knex.raw('p."sizeId"'))
                    .as('size'),
                knex('category_cte as c')
                    .select(
                        knex.raw(`
                            COALESCE(
                                json_agg(
                                    json_build_object('id', c.id, 'name', c.name, 'path', c.path)
                                ),
                                '[]'::json
                            )
                        `),
                    )
                    .whereRaw(
                        `
                            (
                                SELECT "path"
                                FROM "category_cte"
                                WHERE "id" = ${categoryId}
                                LIMIT 1
                            ) LIKE CONCAT("path", '%')
                        `,
                    )
                    .as('categories'),
            )
            .from('Product as p')
            .whereRaw(`p."id" = ${productId}`);
    }

    private get _GET_CATEGORY_QUERY_() {
        return `WITH RECURSIVE c_with_level AS (
            SELECT *,
                CONCAT('/', c."slug") as "path",
                0 as lvl
            FROM "Category" AS c
            WHERE c."parentId" IS NULL
            UNION ALL
            SELECT child.*,
            CONCAT(parent."path", '/', child."slug") as "path",
                parent.lvl + 1
            FROM "Category" AS child
                JOIN c_with_level parent ON parent.id = child."parentId"
        ),
        maxlvl AS (
            SELECT max(lvl) maxlvl
            FROM c_with_level
        ),
        c_tree AS (
            SELECT c_with_level.*,
                jsonb '[]' children,
                CASE
                    WHEN c_with_level."sizeGroupId" IS NOT NULL THEN ARRAY [c_with_level."sizeGroupId"]
                    ELSE '{}'::int []
                END AS "sizeGroups"
            FROM c_with_level,
                maxlvl
            WHERE lvl = maxlvl
            UNION
            (
                SELECT (branch_parent).*,
                    jsonb_agg(branch_child),
                    coalesce(
                        array_agg(DISTINCT size_group_id) FILTER (
                            WHERE size_group_id IS NOT NULL
                        ),
                        '{}'
                    ) "sizeGroups"
                FROM (
                        SELECT branch_parent,
                            branch_child,
                            branch_child."sizeGroupId" as size_group_id
                        FROM c_with_level branch_parent
                            JOIN c_tree branch_child ON branch_child."parentId" = branch_parent.id
                    ) branch
                GROUP BY branch.branch_parent
                UNION
                SELECT c.*,
                    jsonb '[]' children,
                    CASE
                        WHEN c."sizeGroupId" IS NOT NULL THEN ARRAY [c."sizeGroupId"]
                        ELSE '{}'::int []
                    END AS "sizeGroups"
                FROM c_with_level c
                WHERE NOT EXISTS (
                        SELECT 1
                        FROM c_with_level hypothetical_child
                        WHERE hypothetical_child."parentId" = c.id
                    )
            )
        )
        SELECT *
        FROM c_tree
        WHERE lvl = 0
        ORDER BY "order" ASC;`;
    }

    private get _GET_SIZE_GROUP_QUERY_() {
        return `SELECT json_object_agg(res.id, res) as "sizeGroups"
            FROM (
                    SELECT sg.*,
                        COALESCE(
                            json_agg(
                                s
                                ORDER BY s."order" asc
                            ),
                            '{}'
                        ) AS sizes
                    FROM "SizeGroup" sg
                        LEFT JOIN "Size" s ON s."sizeGroupId" = sg.id
                    GROUP BY sg.id
                ) res`;
    }

    private _INSERT_COLORS_QUERY(productId: number, colorIds: number[]) {
        const values = colorIds.map((colorId) => `(${productId}, ${colorId})`).join(', ');

        return `
                WITH i ("productId", "colorId") AS (VALUES ${values})
                    INSERT INTO "ProductColor" ("productId", "colorId")
                SELECT "productId", "colorId"
                    FROM i
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM "ProductColor"
                    WHERE "productId" = i."productId" AND "colorId" = i."colorId" 
                    )
                `;
    }

    private _INSERT_IMAGES_QUERY(productId: number, images: number[]) {
        return `UPDATE "Image" SET "productId"=${productId}
                    WHERE id IN (${images.join(', ')});`;
    }

    /**
     * deletes images that are not in images
     * @productId
     * @images
     */
    private _DELETE_COLORS_QUERY(productId: number, colors: number[]) {
        const knex = (this.ormClient.em as EntityManager).getKnex();

        let toDeleteSubquery = knex('ProductColor as pc')
            .select('pc.colorId')
            .where('pc.productId', productId);
        if (!isEmpty(colors)) toDeleteSubquery = toDeleteSubquery.whereNotIn('pc.colorId', colors);

        const query = knex('ProductColor').delete().whereIn('colorId', toDeleteSubquery);

        return query.toQuery();
    }

    /**
     * deletes images that are not in images
     * @productId
     * @images
     */
    private _DELETE_IMAGES_QUERY(productId: number, images: number[]) {
        return `DELETE FROM "Image" WHERE "id" IN (
            SELECT i."id" FROM "Image" AS i WHERE i."productId" = ${productId} 
                AND i."id" NOT IN ( ${images.join(', ')} )
        )`;
    }

    async getProducts(userId: number, params: TGetProductsParamDto): Promise<TGetProductsResponse> {
        const { products: data, count } = await this._GET_PRODUCTS_QUERY(userId, params);

        const { bucketName, bucketUrl } = this.config.minio;

        const products = data.map(({ thumbnails, ...product }) => ({
            ...product,
            thumbnails: getAbsoluteThumbnails(thumbnails, bucketUrl, bucketName),
        }));

        return {
            products,
            metadata: {
                resultCount: count,
                hasMore: params.offset + params.limit < count,
                offset: params.offset + params.limit,
            },
        };
    }

    getMyProducts(user: TJWTTokenPayload) {
        return this.ormClient.em.find(
            Product,
            { userId: user.userId },
            { populate: ['brand', 'category', 'condition', 'size'] },
        );
    }

    async getLikedProducts(userId: number) {
        const likedProducts = await this._getLikedProducts(userId);

        const { bucketName, bucketUrl } = this.config.minio;

        const products = likedProducts.map(({ thumbnails, ...product }) => ({
            ...product,
            thumbnails: getAbsoluteThumbnails(thumbnails, bucketUrl, bucketName),
        }));

        return products;
    }

    async getProduct(slug: string, user?: TJWTTokenPayload) {
        const product = await this._getProductBySlug(slug, user?.userId);

        if (!product) throw new NotFoundError('Product does not exist');

        const { bucketName, bucketUrl } = this.config.minio;

        product.images = product.images.map(({ thumbnails, ...image }: any) => ({
            ...image,
            original: combineURLs(bucketUrl, [bucketName, image.original]),
            thumbnails: getAbsoluteThumbnails(thumbnails, bucketUrl, bucketName),
        }));

        return product;
    }

    async getAggregatedCategories() {
        const knex = (this.ormClient.em as EntityManager).getKnex();
        const conn = this.ormClient.em.getConnection();
        const categories: Omit<TCategoryAggregated, 'children'>[] = await conn.execute(
            this._GET_CATEGORY_CTE_QUERY_.select('*').from('category_cte').toQuery(),
        );
        // start with base main categories
        const aggregated = categories.filter(({ parentId }) => parentId === null);

        return this.aggregateCategories(aggregated, categories);
    }

    aggregateCategories(
        aggregated: Omit<TCategoryAggregated, 'children'>[],
        categories: Omit<TCategoryAggregated, 'children'>[],
    ): TCategoryAggregated[] {
        if (aggregated.length === 0) return [];

        return aggregated.map((c) => {
            const children = this.aggregateCategories(
                categories.filter(({ parentId }) => parentId === c.id),
                categories,
            );
            const sizeGroups = children.reduce(
                (prev, { sizeGroups }) => [...prev, ...sizeGroups],
                c.sizeGroupId ? [c.sizeGroupId] : [],
            );

            return {
                ...c,
                children,
                sizeGroups: uniq(sizeGroups),
            };
        });
    }

    getSizeGroups() {
        const connection = this.ormClient.em.getConnection();
        return connection
            .execute(this._GET_SIZE_GROUP_QUERY_)
            .then((rows) => rows[0]?.sizeGroups || {});
    }

    async getProductColors() {
        const colors = await this.ormClient.em.find(Color, {});
        return colors;
    }

    async getBrands({ limit = 100, offset = 0, name }: TGetBrandsDto) {
        const condition = name
            ? {
                  name: {
                      $ilike: `%${name}%`,
                  },
              }
            : {};

        const [brands, count] = await this.ormClient.em.findAndCount(Brand, condition, {
            limit,
            offset,
        });

        return { brands, count, limit, offset };
    }

    getConditions() {
        return this.ormClient.em.find(Condition, {}, { orderBy: { order: QueryOrder.ASC } });
    }

    async saveElasticProductDocument(em: EntityManager, productId: number, categoryId: number) {
        const product = await em
            .execute(this._ELASTIC_PRODUCT_DOCUMENT_QUERY(productId, categoryId).toQuery())
            .then((rows) => rows[0] as ElasticProductDocument);

        await this.elasticService.saveProduct(product);

        // create job to index search
        await this.queueService.indexSearch(productId);
    }

    _getSlugString(description: string) {
        const MAX_LENGTH = 100;
        const slugString = description.split(/\r?\n/).filter((el) => el)[0] || '';
        // remove special chars
        const words = slugString
            .trim()
            .replace(/[.\-=/_]/, ' ')
            .split(' ')
            .filter((el) => el)
            .join(' ');

        return words.slice(0, MAX_LENGTH) + new Date().getTime().toString();
    }

    async create(user: TJWTTokenPayload, { colors, images, ...data }: TCreateProductDto) {
        const em = this.ormClient.em.fork() as EntityManager;

        await em.transactional(async (em) => {
            const productData = em.create(Product, {
                ...data,
                userId: user.userId,
                slug: `${user.username}-${generateSlug(this._getSlugString(data.description))}`,
            });
            const qb = em.createQueryBuilder(Product);
            const { id: productId } = (await qb.insert(productData)).row as TProduct;

            if (!isEmpty(colors)) await em.execute(this._INSERT_COLORS_QUERY(productId, colors));

            if (!isEmpty(images)) await em.execute(this._INSERT_IMAGES_QUERY(productId, images));

            // await this.saveElasticProductDocument(em, productId, data.categoryId);
        });

        return {};
    }

    async update(
        user: TJWTTokenPayload,
        { colors, images, ...data }: TCreateProductDto,
        id: number,
    ) {
        const em = this.ormClient.em.fork() as EntityManager;

        await em.transactional(async (em) => {
            const product = await this.ormClient.em.findOne(Product, { id, userId: user.userId });

            if (!product) throw new NotFoundError('Product does not exist');

            product.assign({ ...data, updatedAt: new Date() });

            if (!isEmpty(colors)) {
                await em.execute(this._INSERT_COLORS_QUERY(product.id, colors));
            }
            await em.execute(this._DELETE_COLORS_QUERY(product.id, colors));

            if (!isEmpty(images)) {
                await em.execute(this._INSERT_IMAGES_QUERY(product.id, images));
            }
            await em.execute(this._DELETE_IMAGES_QUERY(product.id, images));

            await em.flush();
            // await this.saveElasticProductDocument(em, id, data.categoryId);
        });

        return {};
    }

    async delete(user: TJWTTokenPayload, id: number) {
        const knex = (this.ormClient.em as EntityManager).getKnex();
        const product = await this.ormClient.em.findOne(Product, {
            userId: user.userId,
            id,
            isDeleted: false,
        });

        if (!product) throw new NotFoundError('Product not found or deleted');

        product.isDeleted = true;

        await this.ormClient.em.flush();

        return {};
    }
    async toggleLike(user: TJWTTokenPayload, { productId }: TToggleProductLike) {
        const connection = this.ormClient.em.getConnection();
        const inserted: number[] = await connection.execute(
            this._INSERT_LIKE_QUERY(user.userId, productId),
        );

        if (inserted.length === 0) {
            await this.ormClient.em.nativeDelete(Like, { userId: user.userId, productId });
        }

        return {};
    }
}
