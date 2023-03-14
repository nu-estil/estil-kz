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
),
maxlvl AS (
    SELECT max(lvl) maxlvl
    FROM c_with_level
),
c_tree AS (
    SELECT c_with_level.*,
        jsonb '[]' children,
        CASE
            WHEN c_with_level."sizeGroupId" IS NOT NULL THEN ARRAY [c_with_level."sizeGroupId"]
            ELSE '{}'::int []
        END AS "sizeGroups"
    FROM c_with_level,
        maxlvl
    WHERE lvl = maxlvl
    UNION
    (
        SELECT (branch_parent).*,
            jsonb_agg(branch_child),
            coalesce(
                array_agg(DISTINCT size_group_id) FILTER (
                    WHERE size_group_id IS NOT NULL
                ),
                '{}'
            ) "sizeGroups"
        FROM (
                SELECT branch_parent,
                    branch_child,
                    branch_child."sizeGroupId" as size_group_id
                FROM c_with_level branch_parent
                    JOIN c_tree branch_child ON branch_child."parentId" = branch_parent.id
            ) branch
        GROUP BY branch.branch_parent
        UNION
        SELECT c.*,
            jsonb '[]' children,
            CASE
                WHEN c."sizeGroupId" IS NOT NULL THEN ARRAY [c."sizeGroupId"]
                ELSE '{}'::int []
            END AS "sizeGroups"
        FROM c_with_level c
        WHERE NOT EXISTS (
                SELECT 1
                FROM c_with_level hypothetical_child
                WHERE hypothetical_child."parentId" = c.id
            )
    )
)
SELECT *
FROM c_tree
WHERE lvl = 0
ORDER BY "order" ASC;