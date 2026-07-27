-- Rollback for migration 001 — drops everything in reverse
-- dependency order. DESTROYS ALL DATA. Development use only.

BEGIN;

DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS wishlist_items;
DROP TABLE IF EXISTS wishlists;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS users;

COMMIT;