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

## Categories
| Method | Route | Access | Notes |
|---|---|---|---|
| GET | /categories | Public | Active categories in sort order, with live product counts |

## Misc
| Method | Route | Notes |
|---|---|---|
| GET | /health | API + database connectivity check |