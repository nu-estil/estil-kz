-- WITH RECURSIVE c_with_level AS (
--     SELECT *,
--         CONCAT('/', c."slug") as "path",
--         0 as lvl
--     FROM "Category" AS c
--     WHERE c."parentId" IS NULL
--     UNION ALL
--     SELECT child.*,
--         CONCAT(parent."path", '/', child."slug") as "path",
--         parent.lvl + 1
--     FROM "Category" AS child
--         JOIN c_with_level parent ON parent.id = child."parentId"
-- ),
-- maxlvl AS (
--     SELECT max(lvl) maxlvl
--     FROM c_with_level
-- ),
-- c_tree AS (
--     SELECT c_with_level.*,
--         jsonb '[]' children,
--         CASE
--             WHEN c_with_level."sizeGroupId" IS NOT NULL THEN ARRAY [c_with_level."sizeGroupId"]
--             ELSE '{}'::int []
--         END AS "sizeGroups"
--     FROM c_with_level,
--         maxlvl
--     WHERE lvl = maxlvl
--     UNION
--     (
--         SELECT (branch_parent).*,
--             jsonb_agg(branch_child),
--             coalesce(
--                 array_agg(DISTINCT size_group_id) FILTER (
--                     WHERE size_group_id IS NOT NULL
--                 ),
--                 '{}'
--             ) "sizeGroups"
--         FROM (
--                 SELECT branch_parent,
--                     branch_child,
--                     branch_child."sizeGroupId" as size_group_id
--                 FROM c_with_level branch_parent
--                     JOIN c_tree branch_child ON branch_child."parentId" = branch_parent.id
--             ) branch
--         GROUP BY branch.branch_parent
--         UNION
--         SELECT c.*,
--             jsonb '[]' children,
--             CASE
--                 WHEN c."sizeGroupId" IS NOT NULL THEN ARRAY [c."sizeGroupId"]
--                 ELSE '{}'::int []
--             END AS "sizeGroups"
--         FROM c_with_level c
--         WHERE NOT EXISTS (
--                 SELECT 1
--                 FROM c_with_level hypothetical_child
--                 WHERE hypothetical_child."parentId" = c.id
--             )
--     )
-- )
-- SELECT *
-- FROM c_tree
-- WHERE id = 301
-- ORDER BY "order" ASC;
with recursive "CATEGORY_CTE" as (
    select "c".*,
        CONCAT('/', c."slug") as "path",
        0 as lvl
    from "Category" as "c"
    where "parentId" is null
    union all
    select "child".*,
        CONCAT(parent."path", '/', child."slug") as "path",
        parent.lvl + 1
    from "Category" as "child"
        inner join "CATEGORY_CTE" as "parent" on "child"."parentId" = "parent"."id"
),
"maxlvl" as (
    select max(lvl) as maxlvl
    from "CATEGORY_CTE"
),
"CATEGORY_TREE_CTE" as (
    (
        select "cc".*,
            jsonb '[]' children,
            CASE
                WHEN cc."sizeGroupId" IS NOT NULL THEN ARRAY [cc."sizeGroupId"]
                ELSE '{}'::int []
            END AS "sizeGroups"
        from "CATEGORY_CTE" AS cc,
            maxlvl
        where "lvl" = maxlvl
    )
    union
    (
        select ("branch_parent").*,
            jsonb_agg(branch_child),
            coalesce(
                array_agg(DISTINCT size_group_id) FILTER (
                    WHERE size_group_id IS NOT NULL
                ),
                '{}'
            ) "sizeGroups"
        from (
                select "branch_parent",
                    "branch_child",
                    "branch_child"."sizeGroupId" as "size_group_id"
                from "CATEGORY_CTE" as "branch_parent"
                    inner join "CATEGORY_TREE_CTE" as "branch_child" on "branch_child"."parentId" = "branch_parent"."id"
            ) as "branch"
        group by "branch"."branch_parent"
        union
        select "c".*,
            jsonb '[]' children,
            CASE
                WHEN c."sizeGroupId" IS NOT NULL THEN ARRAY [c."sizeGroupId"]
                ELSE '{}'::int []
            END AS "sizeGroups"
        from "CATEGORY_CTE" as "c"
        where not exists (
                select 1
                from "CATEGORY_CTE" as "hypothetical_child"
                where "hypothetical_child"."parentId" = c.id
            )
    )
)
select *
from "CATEGORY_TREE_CTE"
where "id" = 301
order by "order" asc