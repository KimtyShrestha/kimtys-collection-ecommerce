-- ============================================================
-- Migration 001 — Initial schema for Kimty's Collection
-- All tables created in a single transaction: if anything
-- fails, nothing is created (no half-built schema).
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- users: customers and administrators (role column decides)
-- ------------------------------------------------------------
CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    full_name       VARCHAR(100) NOT NULL,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    phone           VARCHAR(20),
    role            VARCHAR(10)  NOT NULL DEFAULT 'customer'
                    CHECK (role IN ('customer', 'admin')),
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- addresses: Nepal-style delivery addresses (landmark-based)
-- ------------------------------------------------------------
CREATE TABLE addresses (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label           VARCHAR(30)  NOT NULL DEFAULT 'Home',
    recipient_name  VARCHAR(100) NOT NULL,
    phone           VARCHAR(20)  NOT NULL,
    city            VARCHAR(50)  NOT NULL,
    area            VARCHAR(100) NOT NULL,
    street          VARCHAR(150),
    landmark        VARCHAR(150),
    is_default      BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_addresses_user ON addresses(user_id);

-- ------------------------------------------------------------
-- categories: the nine approved product categories
-- ------------------------------------------------------------
CREATE TABLE categories (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(60)  NOT NULL,
    slug            VARCHAR(80)  NOT NULL UNIQUE,
    description     TEXT,
    image_path      VARCHAR(255),
    sort_order      INTEGER      NOT NULL DEFAULT 0,
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- products
-- RESTRICT on category: a category with products cannot be
-- deleted by accident from the admin panel.
-- ------------------------------------------------------------
CREATE TABLE products (
    id              SERIAL PRIMARY KEY,
    category_id     INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    name            VARCHAR(150) NOT NULL,
    slug            VARCHAR(180) NOT NULL UNIQUE,
    description     TEXT,
    price           NUMERIC(10,2) NOT NULL CHECK (price > 0),
    discount_price  NUMERIC(10,2) CHECK (discount_price IS NULL OR discount_price < price),
    stock           INTEGER      NOT NULL DEFAULT 0 CHECK (stock >= 0),
    age_group       VARCHAR(10)  NOT NULL DEFAULT 'all'
                    CHECK (age_group IN ('0-2', '3-5', '6-9', '10-14', 'all')),
    size            VARCHAR(50),
    colour          VARCHAR(50),
    is_featured     BOOLEAN      NOT NULL DEFAULT FALSE,
    is_new_arrival  BOOLEAN      NOT NULL DEFAULT FALSE,
    is_popular      BOOLEAN      NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_category    ON products(category_id);
CREATE INDEX idx_products_name        ON products(name);
CREATE INDEX idx_products_featured    ON products(is_featured)    WHERE is_featured = TRUE;
CREATE INDEX idx_products_new_arrival ON products(is_new_arrival) WHERE is_new_arrival = TRUE;
CREATE INDEX idx_products_popular     ON products(is_popular)     WHERE is_popular = TRUE;

-- ------------------------------------------------------------
-- product_images: gallery images per product
-- ------------------------------------------------------------
CREATE TABLE product_images (
    id              SERIAL PRIMARY KEY,
    product_id      INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_path      VARCHAR(255) NOT NULL,
    is_primary      BOOLEAN      NOT NULL DEFAULT FALSE,
    sort_order      INTEGER      NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_images_product ON product_images(product_id);

-- ------------------------------------------------------------
-- wishlists: exactly one per user
-- ------------------------------------------------------------
CREATE TABLE wishlists (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE wishlist_items (
    id              SERIAL PRIMARY KEY,
    wishlist_id     INTEGER NOT NULL REFERENCES wishlists(id) ON DELETE CASCADE,
    product_id      INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (wishlist_id, product_id)
);

-- ------------------------------------------------------------
-- orders
-- Shipping details are COPIED in (snapshot), never referenced:
-- editing an address later must not change order history.
-- RESTRICT on user: order history survives account changes.
-- ------------------------------------------------------------
CREATE TABLE orders (
    id              SERIAL PRIMARY KEY,
    order_number    VARCHAR(20)  NOT NULL UNIQUE,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    status          VARCHAR(15)  NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled')),
    payment_method  VARCHAR(10)  NOT NULL
                    CHECK (payment_method IN ('cod','esewa','khalti')),
    payment_status  VARCHAR(10)  NOT NULL DEFAULT 'unpaid'
                    CHECK (payment_status IN ('unpaid','paid')),
    shipping_name     VARCHAR(100) NOT NULL,
    shipping_phone    VARCHAR(20)  NOT NULL,
    shipping_city     VARCHAR(50)  NOT NULL,
    shipping_area     VARCHAR(100) NOT NULL,
    shipping_street   VARCHAR(150),
    shipping_landmark VARCHAR(150),
    subtotal        NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
    delivery_fee    NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0),
    total           NUMERIC(10,2) NOT NULL CHECK (total >= 0),
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user   ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

-- ------------------------------------------------------------
-- order_items
-- product_name and unit_price are SNAPSHOTS taken at purchase:
-- renaming or repricing a product never rewrites history.
-- RESTRICT on product: a product that has been ordered cannot
-- be hard-deleted (admin deactivates it instead).
-- ------------------------------------------------------------
CREATE TABLE order_items (
    id              SERIAL PRIMARY KEY,
    order_id        INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id      INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    product_name    VARCHAR(150) NOT NULL,
    unit_price      NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
    quantity        INTEGER      NOT NULL CHECK (quantity > 0),
    line_total      NUMERIC(10,2) NOT NULL CHECK (line_total >= 0)
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ------------------------------------------------------------
-- reviews: one per customer per product; moderated by admin
-- ------------------------------------------------------------
CREATE TABLE reviews (
    id              SERIAL PRIMARY KEY,
    product_id      INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating          INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title           VARCHAR(120),
    comment         TEXT,
    status          VARCHAR(10) NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','approved','hidden')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (product_id, user_id)
);

CREATE INDEX idx_reviews_product ON reviews(product_id);

COMMIT;