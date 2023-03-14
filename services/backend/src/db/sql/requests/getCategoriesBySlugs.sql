with RECURSIVE CTE as (
    select c."id",
        c."slug",
        CONCAT('/', c."slug") as "path"
    from "Category" AS c
    where "parentId" is null
    union all
    select child."id",
        child."slug",
        CONCAT(c."path", '/', child."slug") as "path"
    from "Category" AS child
        inner join CTE c on child."parentId" = c."id"
)
select "id"
from CTE
where "path" ILIKE '/womens/tops%'