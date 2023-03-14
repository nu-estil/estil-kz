WITH RECURSIVE CATEGORY_RCTE AS (
    SELECT *,
        parent.slug as "parentSlug",
        parent.slug::varchar AS "suggestion"
    FROM "Category" AS parent
    WHERE "id" = (
            SELECT id
            FROM "Category"
            WHERE "parentId" IS NULL
                AND "slug" ~ '\y(ni)'
            LIMIT 1
        )
    UNION ALL
    SELECT child.*,
        parent.slug as "parentSlug",
        CONCAT(parent."parentSlug", ' ', child.slug) AS "suggestion"
    FROM "Category" AS child
        INNER JOIN CATEGORY_RCTE AS parent ON child."parentId" = parent."id"
),
brand_search AS (
    SELECT *
    FROM "Brand"
    WHERE slug ~ '\y(ni)'
),
category_search AS (
    SELECT *
    FROM "Category"
    WHERE slug ~ '\y(ni)'
),
search_results as (
    SELECT id as "categoryId",
        NULL as "brandId",
        "suggestion"
    FROM CATEGORY_RCTE
    UNION ALL
    SELECT c.id as "categoryId",
        b.id as "brandId",
        CONCAT(b.slug, ' ', c.slug) AS "suggestion"
    FROM (
            SELECT *
            FROM category_search
            UNION ALL
            SELECT *
            FROM "Category"
        ) AS c,
        (
            SELECT *
            FROM brand_search
            UNION ALL
            SELECT *
            FROM "Brand"
        ) AS b
)
SELECT suggestion
FROM (
        select suggestion
        from search_results as sr
            INNER JOIN "Product" as p ON p."categoryId" = sr."categoryId"
        UNION
        select suggestion
        from search_results as sr
            INNER JOIN "Product" as p ON p."brandId" = sr."brandId"
    ) AS sr
WHERE "suggestion" ~ '\y(ni)'
order by case
        when "suggestion" ilike ANY (ARRAY ['ni%']) then 0
        else 1
    end,
    suggestion
LIMIT 10