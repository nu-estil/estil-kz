select "p"."id",
    "p"."title",
    "p"."description",
    "p"."slug",
    images,
    (
        SELECT COALESCE(COUNT(*), 0)::INT
        FROM "Like" AS l
        WHERE l."productId" = p."id"
    ) as likes,
    row_to_json(c) as category,
    row_to_json(cn) as condition,
    row_to_json(u) as "seller",
    (
        CASE
            WHEN b is null then null
            ELSE row_to_json(b)
        END
    ) as brand,
    (
        CASE
            WHEN s is null then null
            ELSE row_to_json(s)
        END
    ) as size,
    p."userId" = 1 as moderator,
    EXISTS(
        SELECT 1
        FROM "Like" AS l
        WHERE l."userId" = 1
            and l."productId" = p."id"
    ) as "isLiked"
from "Product" as "p"
    INNER JOIN LATERAL (
        SELECT json_agg(img) as images
        FROM "Image" AS img
        WHERE img."productId" = p."id"
        group by img.order
        ORDER BY img."order" ASC
    ) AS i ON TRUE
    INNER JOIN LATERAL (
        SELECT category.id,
            category.name,
            category.slug
        FROM "Category" AS category
        WHERE p."categoryId" = category."id"
        LIMIT 1
    ) as c ON true
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
            ) as "productCount"
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
WHERE p."slug" = 'test-white-cos-jumper-1'