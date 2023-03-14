SELECT u.username,
    u.name,
    u.description,
    u.avatar,
    u."id" = 1 as moderator,
    EXISTS(
        SELECT 1
        from "Following" AS f
        WHERE f."userId" = u."id"
            AND f."followerId" = 1
    ) AS "isFollowed",
    (
        SELECT count(*)::int
        FROM "Following" as f
        WHERE u."id" = f."userId"
    ) as follorwers,
    (
        SELECT count(*)::int
        FROM "Following" as f
        WHERE u."id" = f."followerId"
    ) as following,
    (
        SELECT json_build_object(
                'count',
                COALESCE(count(*), 0)::int,
                'rating',
                COALESCE(AVG(r.rating), 0)::int
            )
        FROM "Rating" as r
        WHERE u."id" = r."userId"
    ) as "rating",
    (
        SELECT COUNT(*)::int
        FROM "Product" as p
        WHERE u."id" = p."userId"
    ) as "productCount",
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
FROM "User" as u
WHERE username = 'test';