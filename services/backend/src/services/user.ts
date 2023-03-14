import { MikroORM, wrap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { BadRequestError, NotFoundError, UnauthorizedError } from 'routing-controllers';
import { singleton } from 'tsyringe';
import { ConfigWrapper } from '../config';
import { User } from '../entities/user';
import { TJWTTokenPayload, TUserCreateDto, TUserUpdateDto } from '../types';
import { getAbsoluteThumbnails } from '../utils/helpers';

@singleton()
export class UserService {
    private userRepository;

    private config;
    constructor(private ormClient: MikroORM, { config }: ConfigWrapper) {
        this.userRepository = ormClient.em.getRepository(User);
        this.config = config;
    }

    private _getUserByUsername(username: string, watcherId?: number) {
        let qb = (this.ormClient.em as EntityManager)
            .createQueryBuilder(User, 'u')
            .select([
                'u.id',
                'u.username',
                'u.name',
                'u.description',
                'u.avatar',
                'u.lastLoggedIn',
                'u.phone',
            ]).addSelect(`
                (
                    SELECT count(*)::int
                    FROM "Following" as f
                        WHERE u."id" = f."userId"
                ) as follorwers
            `).addSelect(`
                (
                    SELECT count(*)::int
                    FROM "Following" as f
                    WHERE u."id" = f."followerId"
                ) as following
            `).addSelect(`
                (
                    SELECT json_build_object(
                        'count',
                        COALESCE(count(*), 0)::int,
                        'rating',
                        COALESCE(AVG(r.rating), 0)::int
                    )
                    FROM "Rating" as r
                    WHERE u."id" = r."userId"
                ) as "rating"
            `).addSelect(`
                (
                    SELECT COUNT(*)::int
                    FROM "Product" as p
                    WHERE u."id" = p."userId"
                    AND p."isSold" = true
                    AND p."isDeleted" = false
                ) as "productCount"
            `).addSelect(`
                (
                    SELECT COALESCE(json_agg(p), '[]'::json)
                    FROM (
                            SELECT p."id",
                                p."slug",
                                p."price",
                                i."thumbnails"
                            FROM "Product" as p
                                INNER JOIN LATERAL (
                                    SELECT i.thumbnails as thumbnails
                                    FROM "Image" AS i
                                    WHERE p."id" = i."productId"
                                    ORDER BY i."order"
                                    LIMIT 1
                                ) as i ON true
                            WHERE u."id" = p."userId"
                            ORDER BY p.id DESC
                            LIMIT 24
                        ) AS p
                ) as products
            `);

        if (watcherId) {
            qb = qb.addSelect(`u."id" = ${watcherId} as moderator`).addSelect(`
                EXISTS(
                    SELECT 1
                    from "Following" AS f
                    WHERE f."userId" = u."id"
                        AND f."followerId" = ${watcherId}
                ) AS "isFollowed"
            `);
        }

        qb = qb.where({ username });
        return qb.execute('get') as any;
    }
    async getUsers() {
        return this.userRepository.findAll({});
    }

    async getProfile({ userId }: TJWTTokenPayload) {
        const user = await this.ormClient.em.findOne(
            User,
            { id: userId },
            {
                fields: [
                    'id',
                    'username',
                    'avatar',
                    'city',
                    'createdAt',
                    'updatedAt',
                    'email',
                    'name',
                    'description',
                    'phone',
                ],
            },
        );
        if (!user) throw new UnauthorizedError('User not found');

        const { bucketName, bucketUrl } = this.config.minio;
        if (user.avatar) user.avatar = getAbsoluteThumbnails(user.avatar, bucketUrl, bucketName);

        return wrap(user).toJSON();
    }

    // TODO: remove products from request, fetch separately
    async getUser(username: string, userToken?: TJWTTokenPayload) {
        const user = await this._getUserByUsername(username, userToken?.userId);
        if (!user) throw new NotFoundError('User not found');

        const { bucketName, bucketUrl } = this.config.minio;
        user.products = user.products.map(({ thumbnails, ...product }: any) => ({
            ...product,
            thumbnails: getAbsoluteThumbnails(thumbnails, bucketUrl, bucketName),
        }));

        return user;
    }

    async saveUser(data: TUserCreateDto) {
        const user = this.userRepository.create(data);

        await this.userRepository.persist(user).flush();

        return user;
    }

    async updateUser(id: number, data: TUserUpdateDto) {
        const user = await this.userRepository.findOne({ id });

        if (!user) throw new BadRequestError('User does not exist');

        wrap(user).assign(data);

        await this.userRepository.flush();

        return {};
    }
}
