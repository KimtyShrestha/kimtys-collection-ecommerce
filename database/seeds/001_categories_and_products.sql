-- ============================================================
-- Seed 001 — Categories and initial product catalogue
-- Realistic demonstration data for Kimty's Collection.
-- Safe to re-run: existing rows are skipped, not duplicated.
-- ============================================================

BEGIN;

INSERT INTO categories (name, slug, description, sort_order) VALUES
('Baby Clothing',      'baby-clothing',      'Soft, comfortable clothing for babies aged 0–2 years.', 1),
('Girls',              'girls',              'Dresses, sets and everyday wear for girls.',            2),
('Boys',               'boys',               'T-shirts, trousers and everyday wear for boys.',        3),
('Footwear',           'footwear',           'Shoes, sandals and boots for growing feet.',            4),
('School Accessories', 'school-accessories', 'Bags, bottles and everything needed for school.',       5),
('Toys',               'toys',               'Fun and educational toys for every age.',               6),
('Accessories',        'accessories',        'Caps, socks, hairbands and daily essentials.',          7),
('Seasonal Items',     'seasonal-items',     'Winter warmers and summer essentials.',                 8),
('Gift Items',         'gift-items',         'Ready-to-gift sets for birthdays and special days.',    9)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products
(category_id, name, slug, description, price, discount_price, stock, age_group, size, colour, is_featured, is_new_arrival, is_popular)
VALUES
-- Baby Clothing
((SELECT id FROM categories WHERE slug='baby-clothing'), 'Newborn Cotton Bodysuit 5-Pack', 'newborn-cotton-bodysuit-5-pack', 'Set of five breathable 100% cotton bodysuits with envelope necklines for easy dressing. Gentle on newborn skin and machine washable.', 1450.00, 1250.00, 40, '0-2', '0-6 months', 'White / Pastel Mix', TRUE, FALSE, TRUE),
((SELECT id FROM categories WHERE slug='baby-clothing'), 'Fleece Baby Sleepsuit with Mittens', 'fleece-baby-sleepsuit-mittens', 'Warm fleece sleepsuit with fold-over mittens and non-slip feet. Ideal for Kathmandu winters.', 1150.00, NULL, 35, '0-2', '6-12 months', 'Light Blue', FALSE, TRUE, FALSE),
((SELECT id FROM categories WHERE slug='baby-clothing'), 'Muslin Swaddle Wrap Set of 3', 'muslin-swaddle-wrap-set-3', 'Three soft muslin swaddles that get softer with every wash. Breathable enough for year-round use.', 950.00, NULL, 50, '0-2', '75x75 cm', 'Neutral Prints', FALSE, FALSE, FALSE),

-- Girls
((SELECT id FROM categories WHERE slug='girls'), 'Floral Summer Dress', 'floral-summer-dress-girls', 'Light cotton dress with a floral print and twirl-friendly skirt. Concealed side zip and lined bodice.', 1650.00, 1350.00, 30, '3-5', '3-4 / 4-5 years', 'Pink Floral', TRUE, TRUE, TRUE),
((SELECT id FROM categories WHERE slug='girls'), 'Denim Dungaree with T-Shirt', 'denim-dungaree-tshirt-girls', 'Adjustable-strap denim dungaree paired with a striped cotton t-shirt. Built for playgrounds.', 2250.00, NULL, 25, '6-9', '6-7 / 8-9 years', 'Blue Denim', FALSE, FALSE, TRUE),
((SELECT id FROM categories WHERE slug='girls'), 'Winter Knit Cardigan', 'winter-knit-cardigan-girls', 'Chunky knit cardigan with wooden-style buttons. Layers neatly over school uniforms.', 1850.00, NULL, 20, '6-9', '6-7 / 8-9 years', 'Cream', FALSE, TRUE, FALSE),

-- Boys
((SELECT id FROM categories WHERE slug='boys'), 'Graphic Cotton T-Shirt 3-Pack', 'graphic-cotton-tshirt-3-pack-boys', 'Three soft cotton t-shirts with playful prints. Pre-shrunk fabric holds its shape after washing.', 1350.00, 1150.00, 45, '6-9', '6-7 / 8-9 years', 'Assorted', TRUE, FALSE, TRUE),
((SELECT id FROM categories WHERE slug='boys'), 'Cargo Joggers', 'cargo-joggers-boys', 'Comfortable cotton-blend joggers with side pockets and an elasticated waist.', 1550.00, NULL, 30, '10-14', '10-12 / 12-14 years', 'Olive Green', FALSE, TRUE, FALSE),
((SELECT id FROM categories WHERE slug='boys'), 'Hooded Winter Jacket', 'hooded-winter-jacket-boys', 'Padded jacket with a detachable hood and zip pockets. Windproof outer shell for cold mornings.', 3250.00, 2850.00, 18, '10-14', '10-12 / 12-14 years', 'Navy Blue', TRUE, FALSE, FALSE),

-- Footwear
((SELECT id FROM categories WHERE slug='footwear'), 'First Steps Soft Sole Shoes', 'first-steps-soft-sole-shoes', 'Flexible soft-sole shoes that support natural foot development for early walkers.', 1250.00, NULL, 28, '0-2', 'EU 19-22', 'Beige', FALSE, FALSE, TRUE),
((SELECT id FROM categories WHERE slug='footwear'), 'Velcro School Shoes', 'velcro-school-shoes', 'Black school shoes with easy velcro straps and cushioned insoles. Scuff-resistant toe.', 1950.00, NULL, 40, '6-9', 'EU 30-35', 'Black', TRUE, FALSE, TRUE),
((SELECT id FROM categories WHERE slug='footwear'), 'Light-Up Sneakers', 'light-up-sneakers', 'Sneakers with LED soles that light up with every step. USB rechargeable.', 2450.00, 2150.00, 22, '3-5', 'EU 26-30', 'White / Multi', FALSE, TRUE, FALSE),

-- School Accessories
((SELECT id FROM categories WHERE slug='school-accessories'), 'Ergonomic School Backpack', 'ergonomic-school-backpack', 'Lightweight backpack with padded straps, chest clip and a separate bottle pocket.', 2250.00, NULL, 35, '6-9', '18 L', 'Royal Blue', TRUE, FALSE, TRUE),
((SELECT id FROM categories WHERE slug='school-accessories'), 'Insulated Steel Water Bottle', 'insulated-steel-water-bottle', 'Keeps drinks cold for 12 hours. Leak-proof flip lid sized for small hands. 500 ml.', 950.00, 750.00, 60, 'all', '500 ml', 'Teal', FALSE, FALSE, TRUE),
((SELECT id FROM categories WHERE slug='school-accessories'), 'Two-Compartment Lunch Box', 'two-compartment-lunch-box', 'BPA-free lunch box with two sealed compartments and included cutlery.', 850.00, NULL, 55, 'all', NULL, 'Yellow', FALSE, TRUE, FALSE),

-- Toys
((SELECT id FROM categories WHERE slug='toys'), 'Wooden Building Blocks 60 Pieces', 'wooden-building-blocks-60', 'Sixty smooth-sanded wooden blocks in a storage tub. Develops motor skills and creativity.', 1850.00, NULL, 30, '3-5', NULL, 'Natural / Painted', TRUE, FALSE, TRUE),
((SELECT id FROM categories WHERE slug='toys'), 'Remote Control Off-Road Car', 'remote-control-off-road-car', 'Rechargeable RC car with rubber tyres and a 2.4 GHz controller. 40-minute run time.', 2950.00, 2650.00, 15, '6-9', NULL, 'Red', FALSE, TRUE, TRUE),
((SELECT id FROM categories WHERE slug='toys'), 'Soft Plush Elephant 40 cm', 'soft-plush-elephant-40cm', 'Huggable plush elephant made from baby-safe hypoallergenic fabric. Surface washable.', 1150.00, NULL, 42, '0-2', '40 cm', 'Grey', FALSE, FALSE, FALSE),
((SELECT id FROM categories WHERE slug='toys'), 'STEM Science Experiment Kit', 'stem-science-experiment-kit', 'Twenty safe experiments with illustrated instructions. Goggles and tools included.', 2350.00, NULL, 20, '10-14', NULL, NULL, FALSE, TRUE, FALSE),

-- Accessories
((SELECT id FROM categories WHERE slug='accessories'), 'Cotton Socks 6-Pack', 'cotton-socks-6-pack', 'Six pairs of breathable cotton socks with reinforced heels and non-slip grips for toddlers.', 650.00, NULL, 70, '3-5', NULL, 'Assorted', FALSE, FALSE, TRUE),
((SELECT id FROM categories WHERE slug='accessories'), 'Sun Hat with Chin Strap', 'sun-hat-chin-strap', 'Wide-brim sun hat with UPF 50+ fabric and an adjustable chin strap.', 750.00, 600.00, 38, '0-2', NULL, 'Sky Blue', FALSE, TRUE, FALSE),
((SELECT id FROM categories WHERE slug='accessories'), 'Hair Accessories Gift Set', 'hair-accessories-gift-set', 'Twelve-piece set of clips, bands and bows in a keepsake box.', 850.00, NULL, 45, '3-5', NULL, 'Pastel Mix', FALSE, FALSE, FALSE),

-- Seasonal Items
((SELECT id FROM categories WHERE slug='seasonal-items'), 'Kids Woollen Beanie and Glove Set', 'kids-woollen-beanie-glove-set', 'Warm knitted beanie with matching gloves. Soft fleece lining for extra comfort.', 950.00, 800.00, 33, '3-5', NULL, 'Maroon', FALSE, FALSE, TRUE),
((SELECT id FROM categories WHERE slug='seasonal-items'), 'Thermal Base Layer Set', 'thermal-base-layer-set', 'Snug thermal top and leggings that trap warmth without bulk. Perfect under uniforms.', 1450.00, NULL, 26, '6-9', '6-7 / 8-9 years', 'Charcoal', TRUE, TRUE, FALSE),
((SELECT id FROM categories WHERE slug='seasonal-items'), 'Kids Rain Jacket with Bag', 'kids-rain-jacket-with-bag', 'Packable waterproof jacket that folds into its own pouch. Reflective strips for visibility.', 1650.00, NULL, 24, '6-9', '6-7 / 8-9 years', 'Bright Yellow', FALSE, FALSE, FALSE),

-- Gift Items
((SELECT id FROM categories WHERE slug='gift-items'), 'Newborn Welcome Gift Hamper', 'newborn-welcome-gift-hamper', 'Curated hamper with a bodysuit, swaddle, plush toy and milestone cards in a keepsake box.', 3450.00, 2950.00, 15, '0-2', NULL, 'Neutral', TRUE, FALSE, TRUE),
((SELECT id FROM categories WHERE slug='gift-items'), 'Birthday Art & Craft Box', 'birthday-art-craft-box', 'Complete art set with crayons, watercolours, stickers and paper in a carry case.', 1750.00, NULL, 28, '6-9', NULL, NULL, FALSE, TRUE, FALSE),
((SELECT id FROM categories WHERE slug='gift-items'), 'Personalised Name Puzzle', 'personalised-name-puzzle', 'Wooden name puzzle made to order. A meaningful first-birthday gift. Allow 3 days for preparation.', 1950.00, NULL, 20, '0-2', NULL, 'Natural Wood', FALSE, FALSE, FALSE)
ON CONFLICT (slug) DO NOTHING;

COMMIT;