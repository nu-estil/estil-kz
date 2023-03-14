import { MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { BadRequestError } from 'routing-controllers';
import { singleton } from 'tsyringe';
import { Following } from '../entities/following';
import { TJWTTokenPayload } from '../types';
import { TToggleFollowingDto } from '../types/dto/following';

@singleton()
export class FollowingService {
    private followingRepository;
    constructor(private ormClient: MikroORM) {
        this.followingRepository = ormClient.em.getRepository(Following);
    }

    private _INSERT_FOLLOWING_QUERY(followerId: number, followingIds: number[]) {
        const values = followingIds
            .map((followingId) => `(${followingId}, ${followerId})`)
            .join(', ');

        return `WITH i ("userId", "followerId") AS (
                        VALUES ${values}
                        )
                INSERT INTO "Following" ("userId", "followerId")
                SELECT "userId",
                    "followerId"
                FROM i
                WHERE NOT EXISTS (
                        SELECT 1
                        FROM "Following"
                        WHERE "userId" = i."userId"
                            AND "followerId" = i."followerId"
                    )
                RETURNING "userId"
            `;
    }

    async toggleFollowing(user: TJWTTokenPayload, { userIds }: TToggleFollowingDto) {
        const connection = this.ormClient.em.getConnection();

        if (userIds.includes(user.userId)) throw new BadRequestError('Cannot follow yourself');
        // returns array of ids of inserted followings
        const inserted = await connection
            .execute(this._INSERT_FOLLOWING_QUERY(user.userId, userIds))
            .then((rows: Record<'userId', number>[]) => rows.map(({ userId }) => userId));

        const toDelete = userIds.filter((id) => !inserted.includes(id));

        if (toDelete.length > 0)
            await this.ormClient.em.nativeDelete(Following, {
                userId: toDelete,
                followerId: user.userId,
            });

        return { isFollowed: false };
    }

    getFollowers(username: string) {
        const knex = (this.ormClient.em as EntityManager).getKnex();
        const query = knex('Following as f')
            .select('follower.id', 'follower.name', 'follower.username', 'follower.avatar')
            .innerJoin('User AS follower', 'f.followerId', 'follower.id')
            .innerJoin('User AS u', 'f.userId', 'u.id')
            .where('u.username', username)
            .orderBy('f.createdAt', 'desc')
            .toQuery();
        return this.ormClient.em.getConnection().execute(query);
    }

    getFollowings(username: string) {
        const knex = (this.ormClient.em as EntityManager).getKnex();
        const query = knex('Following as f')
            .select('u.id', 'u.name', 'u.username', 'u.avatar')
            .innerJoin('User AS u', 'f.userId', 'u.id')
            .innerJoin('User AS follower', 'f.followerId', 'follower.id')
            .where('follower.username', username)
            .orderBy('f.createdAt', 'desc')
            .toQuery();
        return this.ormClient.em.getConnection().execute(query);
    }
}
