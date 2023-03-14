with RECURSIVE CTE as (
    select c."id",
        c."slug",
        c."name",
        CONCAT('/', c."slug") as "path"
    from "Category" AS c
    where "parentId" is null
    union all
    select child."id",
        child."slug",
        c."name",
        CONCAT(c."path", '/', child."slug") as "path"
    from "Category" AS child
        inner join CTE c on child."parentId" = c."id"
)
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
FROM "Product" AS p
WHERE p."categoryId" IN (
        SELECT id
        FROM CTE
        WHERE "path" LIKE '/womens%'
        ORDER BY "path"
    )
    AND p."brandId" IN (11)
    AND p."sizeId" IN (158)
    AND p."conditionId" IN (6)
    AND p."price" > 0
    and p."price" < 100000
ORDER BY p."createdAt" DESC