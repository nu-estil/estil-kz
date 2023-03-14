BEGIN TRANSACTION;
-- add helper
CREATE OR REPLACE FUNCTION withCategory(cname varchar) RETURNS TABLE (id integer, name varchar, "sizeGroupId" int) LANGUAGE SQL AS '
WITH RECURSIVE cte AS (
    SELECT c.id, c.name, c."sizeGroupId"
    from "Category" as c
    where c.name = cname and c."parentId" is null
    union all
    select  c.id, c.name, c."sizeGroupId"
    from cte
        join "Category" AS c on c."parentId" = cte.id
    )
    select distinct * from cte;
';
-- add main categories
INSERT INTO "Category" (
        "name",
        "slug",
        "order",
        "parentId",
        "sizeGroupId"
    )
VALUES ('womens', 'womens', 0, null, null),
    ('mens', 'mens', 2, null, null),
    ('kids', 'kids', 4, null, null),
    ('other', 'other', 6, null, null);
-- add 2 level categories
WITH ins (
    "name",
    "slug",
    "order",
    "parentName",
    "sizeGroupTitle"
) AS (
    VALUES (
            'tops',
            'tops',
            0,
            'womens',
            'womens-wear'
        ),
        (
            'bottoms',
            'bottoms',
            2,
            'womens',
            'womens-wear'
        ),
        (
            'dresses',
            'dresses',
            4,
            'womens',
            'womens-wear'
        ),
        (
            'lingerie',
            'lingerie',
            6,
            'womens',
            'womens-wear'
        ),
        (
            'outerwear',
            'outerwear',
            8,
            'womens',
            'womens-wear'
        ),
        (
            'accessories',
            'accessories',
            10,
            'womens',
            null
        ),
        (
            'suits',
            'suits',
            10,
            'womens',
            'womens-wear'
        ),
        (
            'shoes',
            'shoes',
            12,
            'womens',
            'womens-shoes'
        ),
        (
            'tops',
            'tops',
            0,
            'mens',
            'mens-wear'
        ),
        (
            'bottoms',
            'bottoms',
            2,
            'mens',
            'mens-wear'
        ),
        (
            'underwear',
            'underwear',
            4,
            'mens',
            'mens-wear'
        ),
        (
            'outerwear',
            'outerwear',
            6,
            'mens',
            'mens-wear'
        ),
        (
            'accessories',
            'accessories',
            8,
            'mens',
            null
        ),
        (
            'shoes',
            'shoes',
            10,
            'mens',
            'mens-shoes'
        ),
        (
            'boys',
            'boys',
            0,
            'kids',
            null
        ),
        (
            'girls',
            'girls',
            2,
            'kids',
            null
        ),
        (
            'toys',
            'toys',
            4,
            'kids',
            null
        ),
        (
            'beauty',
            'beauty',
            0,
            'other',
            null
        ),
        (
            'home',
            'home',
            2,
            'other',
            null
        ),
        (
            'books',
            'books',
            4,
            'other',
            null
        ),
        (
            'arts',
            'arts',
            6,
            'other',
            null
        )
)
INSERT INTO "Category" (
        "name",
        "slug",
        "order",
        "parentId",
        "sizeGroupId"
    )
SELECT ins."name",
    ins."slug",
    ins."order",
    c."id",
    sg."id"
FROM "Category" AS c
    JOIN ins ON ins."parentName" = c."name"
    LEFT JOIN "SizeGroup" AS sg ON ins."sizeGroupTitle" = sg."title";
-- add subcategories
WITH ins (
    "name",
    "slug",
    "order",
    "parentName",
    "sizeGroupTitle"
) AS (
    VALUES (
            'blouses',
            'blouses',
            0,
            'tops',
            null
        ),
        (
            'cardigans',
            'cardigans',
            2,
            'tops',
            null
        ),
        (
            'hoodies',
            'hoodies',
            4,
            'tops',
            null
        ),
        (
            'jumpers',
            'jumpers',
            6,
            'tops',
            null
        ),
        (
            'sweatshirts',
            'sweatshirts',
            8,
            'tops',
            null
        ),
        (
            'vests',
            'vests',
            10,
            'tops',
            null
        ),
        (
            'bandeau-tops',
            'bandeau-tops',
            12,
            'tops',
            null
        ),
        (
            'bodysuits',
            'bodysuits',
            14,
            'tops',
            null
        ),
        (
            'bralets',
            'bralets',
            16,
            'tops',
            null
        ),
        (
            'cami-tops',
            'cami-tops',
            18,
            'tops',
            null
        ),
        (
            'crop-tops',
            'crop-tops',
            20,
            'tops',
            null
        ),
        (
            't-shirts',
            't-shirts',
            22,
            'tops',
            null
        ),
        (
            'other',
            'other',
            24,
            'tops',
            null
        ),
        (
            'jerseys',
            'jerseys',
            26,
            'tops',
            null
        ),
        (
            'bustiers',
            'bustiers',
            28,
            'tops',
            null
        ),
        (
            'shirts',
            'shirts',
            30,
            'tops',
            null
        ),
        (
            'jeans',
            'jeans',
            0,
            'bottoms',
            null
        ),
        (
            'culottes',
            'culottes',
            2,
            'bottoms',
            null
        ),
        (
            'jeggings',
            'jeggings',
            4,
            'bottoms',
            null
        ),
        (
            'pants',
            'pants',
            6,
            'bottoms',
            null
        ),
        (
            'skirts',
            'skirts',
            8,
            'bottoms',
            null
        ),
        (
            'playsuits',
            'playsuits',
            10,
            'bottoms',
            null
        ),
        (
            'leggings',
            'leggings',
            12,
            'bottoms',
            null
        ),
        (
            'shorts',
            'shorts',
            14,
            'bottoms',
            null
        ),
        (
            'joggers',
            'joggers',
            16,
            'bottoms',
            null
        ),
        (
            'casual-dresses',
            'casual-dresses',
            0,
            'dresses',
            null
        ),
        (
            'evening-dresses',
            'evening-dresses',
            2,
            'dresses',
            null
        ),
        (
            'jumpsuits',
            'jumpsuits',
            4,
            'dresses',
            null
        ),
        (
            'midi-dresses',
            'midi-dresses',
            6,
            'dresses',
            null
        ),
        (
            'prom-dresses',
            'prom-dresses',
            8,
            'dresses',
            null
        ),
        (
            'rompers',
            'rompers',
            10,
            'dresses',
            null
        ),
        (
            'summer-dresses',
            'summer-dresses',
            12,
            'dresses',
            null
        ),
        (
            'going-out-dresses',
            'going-out-dresses',
            14,
            'dresses',
            null
        ),
        (
            'max-dresses',
            'max-dresses',
            16,
            'dresses',
            null
        ),
        (
            'suits',
            'suits',
            18,
            'dresses',
            null
        ),
        (
            'other',
            'other',
            20,
            'dresses',
            null
        ),
        (
            'shirt-dresses',
            'shirt-dresses',
            22,
            'dresses',
            null
        ),
        (
            'wrap-dresses',
            'wrap-dresses',
            24,
            'dresses',
            null
        ),
        (
            'pyjamas',
            'pyjamas',
            0,
            'lingerie',
            null
        ),
        (
            'robes',
            'robes',
            2,
            'lingerie',
            null
        ),
        (
            'swimwear',
            'swimwear',
            4,
            'lingerie',
            null
        ),
        (
            'bras',
            'bras',
            6,
            'lingerie',
            null
        ),
        (
            'camisoles',
            'camisoles',
            8,
            'lingerie',
            null
        ),
        (
            'nightgowns',
            'nightgowns',
            10,
            'lingerie',
            null
        ),
        (
            'underwear',
            'underwear',
            12,
            'lingerie',
            null
        ),
        (
            'other',
            'other',
            14,
            'lingerie',
            null
        ),
        (
            'blazers',
            'blazers',
            0,
            'outerwear',
            null
        ),
        (
            'bomber-jackets',
            'bomber-jackets',
            2,
            'outerwear',
            null
        ),
        (
            'denim-jackets',
            'denim-jackets',
            4,
            'outerwear',
            null
        ),
        (
            'parkas',
            'parkas',
            6,
            'outerwear',
            null
        ),
        (
            'puffer-jackets',
            'puffer-jackets',
            8,
            'outerwear',
            null
        ),
        (
            'trench-coats',
            'trench-coats',
            10,
            'outerwear',
            null
        ),
        (
            'other',
            'other',
            12,
            'outerwear',
            null
        ),
        (
            'capes-and-ponchos',
            'capes-and-ponchos',
            14,
            'outerwear',
            null
        ),
        (
            'faux-fur-coats',
            'faux-fur-coats',
            16,
            'outerwear',
            null
        ),
        (
            'leather-jackets',
            'leather-jackets',
            18,
            'outerwear',
            null
        ),
        (
            'pea-coats',
            'pea-coats',
            20,
            'outerwear',
            null
        ),
        (
            'track-jackets',
            'track-jackets',
            22,
            'outerwear',
            null
        ),
        (
            'vests',
            'vests',
            24,
            'outerwear',
            null
        ),
        (
            'windbreakers',
            'windbreakers',
            26,
            'outerwear',
            null
        ),
        (
            'fleeces',
            'fleeces',
            28,
            'outerwear',
            null
        ),
        (
            'snow-suits',
            'snow-suits',
            30,
            'outerwear',
            null
        ),
        (
            'sunglasses',
            'sunglasses',
            0,
            'accessories',
            null
        ),
        (
            'watches',
            'watches',
            2,
            'accessories',
            null
        ),
        (
            'bags-and-purses',
            'bags-and-purses',
            4,
            'accessories',
            null
        ),
        (
            'belts',
            'belts',
            6,
            'accessories',
            null
        ),
        (
            'hair-accessories',
            'hair-accessories',
            8,
            'accessories',
            null
        ),
        (
            'hats',
            'hats',
            10,
            'accessories',
            null
        ),
        (
            'scarves',
            'scarves',
            12,
            'accessories',
            null
        ),
        (
            'socks-and-tights',
            'socks-and-tights',
            14,
            'accessories',
            null
        ),
        (
            'wallets',
            'wallets',
            16,
            'accessories',
            null
        ),
        (
            'other',
            'other',
            18,
            'accessories',
            null
        ),
        (
            'gloves',
            'gloves',
            20,
            'accessories',
            null
        ),
        (
            'caps',
            'caps',
            22,
            'accessories',
            null
        ),
        (
            'boots',
            'boots',
            0,
            'shoes',
            null
        ),
        (
            'loafers',
            'loafers',
            2,
            'shoes',
            null
        ),
        (
            'sandals',
            'sandals',
            4,
            'shoes',
            null
        ),
        (
            'slides',
            'slides',
            6,
            'shoes',
            null
        ),
        (
            'trainers',
            'trainers',
            8,
            'shoes',
            null
        ),
        (
            'other',
            'other',
            10,
            'shoes',
            null
        ),
        (
            'flats',
            'flats',
            12,
            'shoes',
            null
        ),
        (
            'heels',
            'heels',
            14,
            'shoes',
            null
        ),
        (
            'knee-high-boots',
            'knee-high-boots',
            16,
            'shoes',
            null
        ),
        (
            'platforms',
            'platforms',
            18,
            'shoes',
            null
        ),
        (
            'wedges',
            'wedges',
            20,
            'shoes',
            null
        ),
        (
            'ankle-boots',
            'ankle-boots',
            22,
            'shoes',
            null
        ),
        (
            'brogues',
            'brogues',
            24,
            'shoes',
            null
        ),
        (
            'chelsea-boots',
            'chelsea-boots',
            26,
            'shoes',
            null
        ),
        (
            'over-the-knee-boots',
            'over-the-knee-boots',
            28,
            'shoes',
            null
        )
)
INSERT INTO "Category" (
        "name",
        "slug",
        "order",
        "parentId",
        "sizeGroupId"
    )
SELECT ins."name",
    ins."slug",
    ins."order",
    c."id",
    COALESCE(sg."id", c."sizeGroupId", null)
FROM withCategory('womens') AS c
    INNER JOIN ins ON ins."parentName" = c."name"
    LEFT JOIN "SizeGroup" AS sg ON ins."sizeGroupTitle" = sg."title";
-- add subcategories for men
WITH ins (
    "name",
    "slug",
    "order",
    "parentName",
    "sizeGroupTitle"
) AS (
    VALUES (
            'cardigans',
            'cardigans',
            0,
            'tops',
            null
        ),
        (
            'casual-shirts',
            'casual-shirts',
            2,
            'tops',
            null
        ),
        (
            'hoodies',
            'hoodies',
            4,
            'tops',
            null
        ),
        (
            'jumpers',
            'jumpers',
            6,
            'tops',
            null
        ),
        (
            't-shirts',
            't-shirts',
            8,
            'tops',
            null
        ),
        (
            'other',
            'other',
            10,
            'tops',
            null
        ),
        (
            'dress-shirts',
            'dress-shirts',
            12,
            'tops',
            null
        ),
        (
            'polo-shirts',
            'polo-shirts',
            14,
            'tops',
            null
        ),
        (
            'sweatshirts',
            'sweatshirts',
            16,
            'tops',
            null
        ),
        (
            'tank-tops',
            'tank-tops',
            18,
            'tops',
            null
        ),
        (
            'jerseys',
            'jerseys',
            20,
            'tops',
            null
        ),
        (
            'dungarees',
            'dungarees',
            0,
            'bottoms',
            null
        ),
        (
            'tracksuits',
            'tracksuits',
            2,
            'bottoms',
            null
        ),
        (
            'casual-pants',
            'casual-pants',
            4,
            'bottoms',
            null
        ),
        (
            'dress-pants',
            'dress-pants',
            6,
            'bottoms',
            null
        ),
        (
            'jeans',
            'jeans',
            8,
            'bottoms',
            null
        ),
        (
            'shorts',
            'shorts',
            10,
            'bottoms',
            null
        ),
        (
            'sweatpants',
            'sweatpants',
            12,
            'bottoms',
            null
        ),
        (
            'other',
            'other',
            14,
            'bottoms',
            null
        ),
        (
            'overalls',
            'overalls',
            16,
            'bottoms',
            null
        ),
        (
            'boxers',
            'boxers',
            0,
            'underwear',
            null
        ),
        (
            'briefs',
            'briefs',
            2,
            'underwear',
            null
        ),
        (
            'other',
            'other',
            4,
            'underwear',
            null
        ),
        (
            'swimwear',
            'swimwear',
            6,
            'underwear',
            null
        ),
        (
            'blazers',
            'blazers',
            0,
            'outerwear',
            null
        ),
        (
            'bomber-jackets',
            'bomber-jackets',
            2,
            'outerwear',
            null
        ),
        (
            'denim-jackets',
            'denim-jackets',
            4,
            'outerwear',
            null
        ),
        (
            'gilets',
            'gilets',
            6,
            'outerwear',
            null
        ),
        (
            'leather-jackets',
            'leather-jackets',
            8,
            'outerwear',
            null
        ),
        (
            'parkas',
            'parkas',
            10,
            'outerwear',
            null
        ),
        (
            'pea-coats',
            'pea-coats',
            12,
            'outerwear',
            null
        ),
        (
            'track-jackets',
            'track-jackets',
            14,
            'outerwear',
            null
        ),
        (
            'windbreakers',
            'windbreakers',
            16,
            'outerwear',
            null
        ),
        (
            'capes-and-ponchos',
            'capes-and-ponchos',
            18,
            'outerwear',
            null
        ),
        (
            'puffer-jackets',
            'puffer-jackets',
            20,
            'outerwear',
            null
        ),
        (
            'suits',
            'suits',
            22,
            'outerwear',
            null
        ),
        (
            'trench-coats',
            'trench-coats',
            24,
            'outerwear',
            null
        ),
        (
            'other',
            'other',
            26,
            'outerwear',
            null
        ),
        (
            'fleeces',
            'fleeces',
            28,
            'outerwear',
            null
        ),
        (
            'snow-suits',
            'snow-suits',
            30,
            'outerwear',
            null
        ),
        (
            'belts',
            'belts',
            0,
            'accessories',
            null
        ),
        (
            'gloves',
            'gloves',
            2,
            'accessories',
            null
        ),
        (
            'scarves',
            'scarves',
            4,
            'accessories',
            null
        ),
        (
            'socks',
            'socks',
            6,
            'accessories',
            null
        ),
        (
            'sunglasses',
            'sunglasses',
            8,
            'accessories',
            null
        ),
        (
            'watches',
            'watches',
            10,
            'accessories',
            null
        ),
        (
            'other',
            'other',
            12,
            'accessories',
            null
        ),
        (
            'bags',
            'bags',
            14,
            'accessories',
            null
        ),
        (
            'caps',
            'caps',
            16,
            'accessories',
            null
        ),
        (
            'hats',
            'hats',
            18,
            'accessories',
            null
        ),
        (
            'ankle-boots',
            'ankle-boots',
            0,
            'shoes',
            null
        ),
        (
            'casual-shoes',
            'casual-shoes',
            2,
            'shoes',
            null
        ),
        (
            'dress-shoes',
            'dress-shoes',
            4,
            'shoes',
            null
        ),
        (
            'other',
            'other',
            6,
            'shoes',
            null
        ),
        (
            'flip-flops-and-slides',
            'flip-flops-and-slides',
            8,
            'shoes',
            null
        ),
        (
            'sneakers',
            'sneakers',
            10,
            'shoes',
            null
        ),
        (
            'boots',
            'boots',
            12,
            'shoes',
            null
        ),
        (
            'brogues',
            'brogues',
            14,
            'shoes',
            null
        ),
        (
            'chelsea-boots',
            'chelsea-boots',
            16,
            'shoes',
            null
        )
)
INSERT INTO "Category" (
        "name",
        "slug",
        "order",
        "parentId",
        "sizeGroupId"
    )
SELECT ins."name",
    ins."slug",
    ins."order",
    c."id",
    COALESCE(sg."id", c."sizeGroupId", null)
FROM withCategory('mens') AS c
    INNER JOIN ins ON ins."parentName" = c."name"
    LEFT JOIN "SizeGroup" AS sg ON ins."sizeGroupTitle" = sg."title";
-- add subcategories for other
WITH ins (
    "name",
    "slug",
    "order",
    "parentName",
    "sizeGroupTitle"
) AS (
    VALUES (
            'makeup',
            'makeup',
            0,
            'beauty',
            null
        ),
        (
            'tools-and-brushes',
            'tools-and-brushes',
            2,
            'beauty',
            null
        ),
        (
            'bath-and-body',
            'bath-and-body',
            4,
            'beauty',
            null
        ),
        (
            'fragrance',
            'fragrance',
            6,
            'beauty',
            null
        ),
        (
            'hair',
            'hair',
            8,
            'beauty',
            null
        ),
        (
            'skincare',
            'skincare',
            10,
            'beauty',
            null
        ),
        (
            'other',
            'other',
            12,
            'beauty',
            null
        )
)
INSERT INTO "Category" (
        "name",
        "slug",
        "order",
        "parentId",
        "sizeGroupId"
    )
SELECT ins."name",
    ins."slug",
    ins."order",
    c."id",
    COALESCE(sg."id", c."sizeGroupId", null)
FROM withCategory('other') AS c
    INNER JOIN ins ON ins."parentName" = c."name"
    LEFT JOIN "SizeGroup" AS sg ON ins."sizeGroupTitle" = sg."title";
COMMIT;