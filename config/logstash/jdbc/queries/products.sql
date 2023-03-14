WITH RECURSIVE c_with_level AS (
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
)
SELECT id,
    description,
    price,
    "currency",
    "slug",
    "isActive",
    "isApproved",
    "isDeleted",
    "isSold",
    to_char (
        "createdAt"::timestamp at time zone 'UTC',
        'YYYY-MM-DD"T"HH24:MI:SS"Z"'
    ) as "createdAt",
    to_char (
        "updatedAt"::timestamp at time zone 'UTC',
        'YYYY-MM-DD"T"HH24:MI:SS"Z"'
    ) as "updatedAt",
    (
        select CAST(
                json_build_object('id', u.id, 'username', u.username) as VARCHAR
            )
        from "User" as u
        where u.id = p."userId"
        limit 1
    ) as "user",
    (
        select CAST(
                json_build_object('id', c.id, 'name', c.name, 'slug', c.slug) as VARCHAR
            )
        from "City" as c
        where c.id = p."cityId"
        limit 1
    ) as "city",
    (
        SELECT CAST(
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
                    ),
                    '[]'::json
                ) AS VARCHAR
            )
        FROM "Image" i
        WHERE i."productId" = p.id
        GROUP BY i."order"
        ORDER BY i."order"
    ) as images,
    (
        SELECT CAST(
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
                ) AS VARCHAR
            )
        FROM "ProductColor" pc
            INNER JOIN "Color" AS c ON c."id" = pc."colorId"
            AND pc."productId" = p.id
    ) as colors,
    (
        SELECT CAST(
                json_build_object('id', b.id, 'name', b.name) AS VARCHAR
            )
        FROM "Brand" AS b
        WHERE b."id" = p."brandId"
    ) as brand,
    (
        SELECT CAST(
                json_build_object('id', c.id, 'title', c.title) AS VARCHAR
            )
        FROM "Condition" AS c
        WHERE c."id" = p."conditionId"
    ) as condition,
    (
        SELECT CAST(
                json_build_object('id', s.id, 'title', s.title) AS VARCHAR
            )
        FROM "Size" AS s
        WHERE s."id" = p."sizeId"
    ) as size,
    (
        SELECT CAST(
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id',
                            c.id,
                            'keywords',
                            c.synonyms,
                            'name',
                            c.name,
                            'path',
                            c.path
                        )
                    ),
                    '[]'::json
                ) AS VARCHAR
            )
        FROM c_with_level as c
        WHERE (
                SELECT "path"
                FROM c_with_level
                WHERE "id" = p."categoryId"
                LIMIT 1
            ) LIKE CONCAT("path", '%')
    ) as categories
FROM "Product" AS p
WHERE p."updatedAt" > :sql_last_value