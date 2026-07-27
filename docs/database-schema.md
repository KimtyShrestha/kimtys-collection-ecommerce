# Database Schema — Kimty's Collection

Database: `kimtys_collection_db` (PostgreSQL 18). Managed via SQL migrations in
`database/migrations/`, executed with `npm run migrate` (backend). Applied
migrations are tracked in `schema_migrations`. Seeds live in `database/seeds/`
(`npm run seed`, safe to re-run). Rollback: `npm run migrate:rollback`
(destroys all data — development only).

## Tables (Migration 001)

| Table | Purpose | Key decisions |
|---|---|---|
| users | Customers and admins | Single table; `role` drives authorisation |
| addresses | Delivery addresses | Nepal-style: city/area/street/landmark |
| categories | Nine product categories | URL slugs; sort_order; soft-active flag |
| products | Catalogue | RESTRICT delete from category; CHECK price/stock; partial indexes on homepage flags |
| product_images | Gallery per product | CASCADE with product |
| wishlists / wishlist_items | One wishlist per user | UNIQUE (wishlist, product) |
| orders | Placed orders | Shipping **snapshotted** into the row; human order_number (KC-YYYY-NNNN); status + payment CHECKs |
| order_items | Order lines | product_name and unit_price **snapshotted**; RESTRICT product delete |
| reviews | Product reviews | 1–5 CHECK; moderation status; one per user per product |

## Conventions
- `SERIAL` PKs, `TIMESTAMPTZ` timestamps; `updated_at` maintained by application code.
- All queries parameterised (`$1, $2, …`) — SQL injection protection.
- No server-side cart table: cart is client-side, validated server-side at checkout.

## Known Limitations
- Connects as the `postgres` superuser (development convenience).
- Simulated payments only; `payment_status` is illustrative.