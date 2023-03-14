SELECT u.id,
    u.name,
    u.username,
    u.avatar
FROM "Following" AS f
    INNER JOIN "User" AS u ON f."userId" = u."id"
WHERE f."followerId" = 1