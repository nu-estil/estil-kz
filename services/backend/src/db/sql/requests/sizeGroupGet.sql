SELECT json_object_agg(res.id, res) as "sizeGroups"
FROM (
        SELECT sg.*,
            COALESCE(
                json_agg(
                    s
                    ORDER BY s."order" asc
                ),
                '{}'
            ) AS sizes
        FROM "SizeGroup" sg
            LEFT JOIN "Size" s ON s."sizeGroupId" = sg.id
        GROUP BY sg.id
    ) res