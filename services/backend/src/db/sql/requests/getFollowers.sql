SELECT u.id,
    u.name,
    u.username,
    u.avatar
FROM "Following" AS f
    INNER JOIN "User" AS follower ON f."followerId" = follower."id"
    INNER JOIN "User" AS u ON f."userId" = u."id"
    AND u."username" = 'test'