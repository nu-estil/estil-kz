WITH i ("userId", "followerId") AS (
    VALUES (1, 4)
)
INSERT INTO "Following" ("userId", "followerId")
SELECT "userId",
    "followerId"
FROM i
WHERE NOT EXISTS (
        SELECT 1
        FROM "Following"
        WHERE "userId" = i."userId"
            AND "followerId" = i."followerId"
    )
RETURNING "userId"