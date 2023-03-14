-- explain analyze WITH RECURSIVE CATEGORY_RCTE AS (
--     SELECT *,
--         parent.slug as "parentSlug",
--         parent.slug::varchar AS "suggestion"
--     FROM "Category" AS parent
--     WHERE "parentId" IS NULL
--         AND "slug" ~ 'ywomens|yw'
--     UNION ALL
--     SELECT child.*,
--         parent.slug as "parentSlug",
--         CONCAT(parent."parentSlug", ' ', child.slug) AS "suggestion"
--     FROM "Category" AS child
--         INNER JOIN CATEGORY_RCTE AS parent ON child."parentId" = parent."id"
-- ),
-- brand_search AS (
--     SELECT *
--     FROM "Brand"
--     WHERE slug ~ 'ywomens|yw'
-- ),
-- category_search AS (
--     SELECT *
--     FROM "Category"
--     WHERE slug ~ 'ywomens|yw'
-- ),
-- product_search AS (
--     SELECT *
--     FROM "Product"
--     WHERE title ~ 'ywomens|yw'
-- ),
-- search_results as (
--     SELECT "suggestion"
--     FROM CATEGORY_RCTE
--     UNION ALL
--     SELECT slug
--     FROM category_search
--     UNION ALL
--     SELECT slug
--     FROM brand_search
--     UNION ALL
--     SELECT title
--     FROM product_search
-- )
-- SELECT suggestion
-- FROM search_results
-- WHERE "suggestion" ~ 'ywomens|yw'
-- order by case
--         when "suggestion" ilike ANY (ARRAY ['womens%', 'w%']) then 0
--         else 1
--     end,
--     suggestion
-- LIMIT 10
with recursive "category_cte" as (
    select *,
        "parent"."slug" as "parentSlug",
        "parent"."slug"::varchar as "suggestion"
    from "Category" as "parent"
    where "parentId" is null
        and "slug" ~ 'mens|health'
    union all
    select "child".*,
        "parent"."slug" as "parentSlug",
        CONCAT(parent."parentSlug", ' ', child.slug) as "suggestion"
    from "Category" as "child"
        inner join "category_cte" as "parent" on "child"."parentId" = "parent"."id"
),
"product_search" as (
    select *
    from "Product"
    where "title" ~ 'mens|health'
),
"brand_search" as (
    select *
    from "Brand"
    where "slug" ~ 'mens|health'
),
"category_search" as (
    select *
    from "Category"
    where "slug" ~ 'mens|health'
),
"search_result" as (
    select "suggestion"
    from "category_cte"
    union all
    select "slug"
    from "category_search"
    union all
    select "slug"
    from "brand_search"
    union all
    select "title"
    from "product_search"
)
select *
from (
        select distinct "suggestion"
        from "search_result"
        where suggestion ~ 'mens|health'
    ) as res
order by case
        when "suggestion" ilike ANY (ARRAY ['mens%', 'health%']) then 0
        else 1
    end,
    suggestion
limit 10