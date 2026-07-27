# API Documentation — Kimty's Collection

Base URL: `http://localhost:5000/api`. All responses use the envelope
`{ success, message, data? }`. Protected routes require
`Authorization: Bearer <token>`.

## Auth
| Method | Route | Access | Body | Notes |
|---|---|---|---|---|
| POST | /auth/register | Public | fullName, email, password, phone? | 201; returns user + token. 409 on duplicate email |
| POST | /auth/login | Public | email, password | Returns user + token. Generic 401 on bad credentials |
| GET | /auth/me | Logged in | — | Returns current user; used for session restore |

## Products
| Method | Route | Access | Query | Notes |
|---|---|---|---|---|
| GET | /products | Public | featured, newArrival, popular, sale (=true), limit (1–50) | Active products, newest first. Filters/search/pagination extended in Phase 9 |
| GET | /products/:slug | Public | — | Full product detail. 404 if unknown/inactive |
| GET | /products/:slug/related | Public | — | Up to 4 same-category products, excluding the product itself |

## Categories
| Method | Route | Access | Notes |
|---|---|---|---|
| GET | /categories | Public | Active categories in sort order, with live product counts |

## Orders
| Method | Route | Access | Body | Notes |
|---|---|---|---|---|
| POST | /orders | Logged in | items[{productId, quantity}], paymentMethod (cod, esewa, khalti), shipping{name, phone, city, area, street?, landmark?} | Transactional: revalidates price/stock server-side (client prices ignored), locks rows, snapshots shipping + product name/price, decrements stock, generates KC-YYYY-NNNN. Delivery Rs. 100, free ≥ Rs. 3,000 |
| GET | /orders/:orderNumber | Owner | — | Full order with items. 404 if not owner |

## Users
| Method | Route | Access | Body | Notes |
|---|---|---|---|---|
| PUT | /users/profile | Logged in | fullName, phone? | Returns updated user |
| PUT | /users/password | Logged in | currentPassword, newPassword | 401 if current wrong; generic success |

## Addresses
| Method | Route | Access | Notes |
|---|---|---|---|
| GET | /addresses | Logged in | Default first, then newest |
| POST | /addresses | Logged in | First address auto-default; isDefault=true reassigns transactionally |
| PUT | /addresses/:id | Logged in | Owner only; 404 otherwise |
| DELETE | /addresses/:id | Logged in | Deleting the default promotes the newest remaining |

## Wishlist
| Method | Route | Access | Notes |
|---|---|---|---|
| GET | /wishlist | Logged in | Full product cards |
| GET | /wishlist/ids | Logged in | Product ids only (for heart states) |
| POST | /wishlist | Logged in | { productId } — idempotent |
| DELETE | /wishlist/:productId | Logged in | — |

(Orders: GET /orders now also returns the customer's order history.)

## Reviews
| Method | Route | Access | Notes |
|---|---|---|---|
| GET | /products/:slug/reviews | Public (richer when logged in) | Approved reviews + viewer's own (any status); summary counts approved only |
| POST | /reviews | Logged in | { productId, rating 1–5, title?, comment? } — one per product; starts pending |
| PUT | /reviews/:id | Owner | Editing resets status to pending |
| DELETE | /reviews/:id | Owner | — |


## Misc
| Method | Route | Notes |
|---|---|---|
| GET | /health | API + database connectivity check |

