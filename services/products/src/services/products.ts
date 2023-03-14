import { ElasticClient, ElasticQuery, ElasticSearchTotalHits } from '@depop/elastic';
import _, { isNumber } from 'lodash';
import isEmpty from 'lodash/isEmpty';
import { NotFoundError } from 'routing-controllers';
import { singleton } from 'tsyringe';
import { ConfigWrapper } from '../config';
import { productIndex, searchIndex } from '../indices';
import { ProductDocument, SuggestionDocument } from '../types/documents/products';
import { TGetProductsParamDto } from '../types/dto/products';
import { TGetProductsResponse } from '../types/response/products';
import { generateElasticIndex, getAbsoluteThumbnails } from '../utils/helpers';

@singleton()
export class ProductService {
    private config;
    constructor(private elastic: ElasticClient, { config }: ConfigWrapper) {
        this.config = config;
    }

    async getSuggestions(title: string) {
        const {
            hits: { hits },
        } = await this.elastic.search<SuggestionDocument>({
            index: searchIndex.index,
            query: {
                match: {
                    title: {
                        query: title.trim(),
                        operator: 'and',
                    },
                },
            },
            highlight: {
                fields: {
                    title: {
                        pre_tags: ['**'],
                        post_tags: ['**'],
                    },
                },
            },
            size: 10,
            // aggs: {
            //     suggestions: {
            //         terms: {
            //             field: 'title',
            //         },
            //     },
            // },
        });

        const suggestions = hits.map(({ highlight }) => highlight?.title[0]).filter((v) => v);
        return { suggestions };
    }

    async saveSuggestions(suggestions: string[]) {
        const docs = suggestions.map((title) => ({ title }));

        const operations = docs.flatMap((doc) => [
            {
                create: {
                    _index: searchIndex.index,
                    _id: generateElasticIndex(doc.title),
                },
            },
            doc,
        ]);

        await this.elastic.bulk<SuggestionDocument>({
            refresh: true,
            operations,
        });
    }

    saveProduct(product: ProductDocument) {
        return this.elastic.update<ProductDocument>({
            index: productIndex.index,
            id: String(product.id),
            refresh: true,
            doc: product,
            doc_as_upsert: true,
        });
    }

    async getProduct(_id: number) {
        const {
            hits: { hits },
        } = await this.elastic.search<ProductDocument>({
            index: productIndex.index,
            query: {
                term: {
                    _id,
                },
            },
        });

        if (isEmpty(hits)) throw new NotFoundError(`Product not found by id ${_id}`);

        return hits[0]._source;
    }

    async getProducts({
        search,
        sort: sortType = 'relevance',
        ...filter
    }: TGetProductsParamDto): Promise<TGetProductsResponse> {
        const queryFilter = [];
        const queryMust = [];
        const sort = [] as any[];

        if (sortType === 'relevance') sort.push('_score');
        else if (sortType === 'recent')
            sort.push({
                createdAt: {
                    order: 'desc',
                },
            });
        else if (sortType === 'priceMin')
            sort.push({
                price: {
                    order: 'asc',
                },
            });
        else if (sortType === 'priceMax')
            sort.push({
                price: {
                    order: 'desc',
                },
            });

        if (search)
            queryMust.push({
                query_string: {
                    query: search
                        .trim()
                        .split(' ')
                        .map((s) => `(${s}~)`)
                        .join(' OR '),
                    fields: [
                        'brand.name',
                        'categories.name',
                        'categories.keywords.keyword',
                        'description',
                        'colors.title',
                    ],
                    fuzziness: '1',
                },
            });

        if (!isEmpty(filter.username))
            queryFilter.push({ term: { 'user.username': filter.username } });

        if (!isEmpty(filter.categories) && Array.isArray(filter.categories))
            queryFilter.push({ terms: { 'categories.id': filter.categories as number[] } });

        if (!isEmpty(filter.brands) && Array.isArray(filter.brands))
            queryFilter.push({ terms: { 'brand.id': filter.brands as number[] } });

        if (!isEmpty(filter.conditions) && Array.isArray(filter.conditions))
            queryFilter.push({ terms: { 'condition.id': filter.conditions as number[] } });

        if (!isEmpty(filter.sizes) && Array.isArray(filter.sizes))
            queryFilter.push({ terms: { 'size.id': filter.sizes as number[] } });

        if (!isEmpty(filter.colors) && Array.isArray(filter.colors))
            queryFilter.push({ terms: { 'colors.id': filter.colors as number[] } });

        if (isNumber(filter.city)) queryFilter.push({ term: { 'city.id': filter.city } });

        if (filter.minPrice || filter.maxPrice)
            queryFilter.push({
                range: {
                    price: _.pickBy(
                        {
                            gte: filter.minPrice,
                            lte: filter.maxPrice,
                        },
                        _.isNumber,
                    ),
                },
            });

        queryFilter.push({ term: { isSold: filter.isSold || false } });
        queryFilter.push({ term: { isActive: filter.isActive || true } });
        queryFilter.push({ term: { isApproved: filter.isApproved || true } });
        // filter not deleted products
        queryFilter.push({ term: { isDeleted: false } });

        const query: ElasticQuery = {
            bool: {
                must: queryMust,
                filter: queryFilter,
            },
        };

        console.log(JSON.stringify(query));
        const {
            hits: { hits, total },
        } = await this.elastic.search<ProductDocument>({
            index: productIndex.index,
            query,
            sort,
            _source: ['id', 'price', 'slug'],
            script_fields: {
                image: {
                    script: {
                        lang: 'painless',
                        source: "params['_source'].images.stream().findFirst().orElse(null)",
                    },
                },
            },
            size: filter.limit,
            from: filter.offset,
        });

        const { bucketName, bucketUrl } = this.config.minio;
        //TODO: if no preview needed remove
        const products = hits.map(({ _source, fields }) => ({
            ..._source,
            thumbnails: getAbsoluteThumbnails(
                fields?.image?.[0]?.thumbnails || {},
                bucketUrl,
                bucketName,
            ),
        }));

        const resultCount = (total as ElasticSearchTotalHits).value;
        return {
            products,
            metadata: {
                hasMore: filter.limit + filter.offset < resultCount,
                offset: filter.offset + filter.limit,
                resultCount,
            },
        };
    }
}
