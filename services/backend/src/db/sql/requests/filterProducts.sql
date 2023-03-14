WITH RECURSIVE CTE AS (
    SELECT c.id
    FROM "Category" AS c
    WHERE c."id" IN (
            SELECT id
            FROM "Category"
            WHERE c."id" = 181
        )
    UNION ALL
    SELECT child.id
    FROM "Category" AS child
        JOIN CTE parent ON parent.id = child."parentId"
),
brands_search AS (
    SELECT id
    from "Brand"
    where id IN (11)
)
select distinct(p."id"),
    p."slug",
    p."price",
    (
        SELECT i.thumbnails
        FROM "Image" AS i
        WHERE p."id" = i."productId"
        ORDER BY i."order"
        LIMIT 1
    ) as thumbnails
from "Product" as p
WHERE p."categoryId" IN (
        SELECT id
        FROM CTE
    )
    OR p."categoryId" IN (
        SELECT id
        FROM "Category"
        WHERE slug ~ '\yzara'
    )
    AND p."brandId" IN (11)
    OR p."brandId" IN (
        SELECT id
        FROM "Brand"
        where slug ~ '\yzara'
    )
    AND p."sizeId" IN (158)
    AND p."conditionId" IN (6)
    AND p."price" > 0
    and p."price" < 100000
ORDER BY p."id" DESC;