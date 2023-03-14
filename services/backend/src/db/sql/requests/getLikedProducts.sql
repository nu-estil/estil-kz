SELECT p."id",
    p."slug",
    p."price",
    (
        SELECT i.thumbnails
        FROM "Image" AS i
        WHERE p."id" = i."productId"
        ORDER BY i."order"
        LIMIT 1
    ) as thumbnails
FROM "Like" as l
    INNER JOIN "Product" AS p ON l."productId" = p."id"
    INNER JOIN "User" AS u ON l."userId" = u."id"
WHERE u."username" = 'Susamusa'
ORDER BY l."createdAt" desc