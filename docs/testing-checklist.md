# Testing Checklist — Kimty's Collection

## Responsive Testing (Phase 19)

Tested at 375 px (mobile), 768 px (tablet), 1024 px (laptop), 1440 px (desktop)
in Chrome DevTools device emulation.

| Page | 375 | 768 | 1024 | 1440 | Notes |
|---|---|---|---|---|---|
| Home | | | | | |
| Shop | | | | | Filter sidebar → drawer below 1024 px |
| Product Details | | | | | Image stacks above details below 1024 px |
| Cart | | | | | Summary moves below items below 1024 px |
| Checkout | | | | | Order summary stacks below form |
| Order Confirmation | | | | | |
| Account (all pages) | | | | | Sidebar → scrollable tab row below 1024 px |
| Wishlist | | | | | 2-column grid on mobile |
| Static pages | | | | | |
| Admin Dashboard | | | | | Stat cards stack; chart stays readable |
| Admin tables | | | | | Horizontal scroll retained on mobile (see rationale) |
| Admin forms | | | | | Single column below 1024 px |

**Mark each cell: PASS / issue description.**

### Admin table strategy — rationale
Admin tables use horizontal scrolling rather than a mobile card layout.
Admin work is desktop-first (store staff use desktop computers, per the
Project Brain), and row-based comparison — scanning stock levels or order
statuses down a column — is the primary task. Converting to cards would
preserve readability but destroy scannability, so scrolling was chosen as
the lesser compromise for an interface that is rarely used on a phone.

## Accessibility Testing (Phase 19)

| Check | Result | Notes |
|---|---|---|
| Skip-to-content link | | Tab once from page top |
| Visible focus indicators | | All interactive elements |
| Modal focus trap and restore | | |
| Body scroll lock (drawers/modals) | | |
| Form labels associated | | |
| Error messages textual, not colour-only | | |
| Logical heading hierarchy | | One h1 per page |
| Alt text on images; icons aria-hidden | | |
| Touch targets ≥ 40 px | | |
| Reduced-motion preference respected | | |
| Keyboard-only full journey (browse → cart → checkout) | | |

### Lighthouse Accessibility Scores
| Page | Score | Date |
|---|---|---|
| Home | | |
| Shop | | |
| Product Details | | |
| Checkout | | |
| Admin Dashboard | | |

## Functional Testing
_Completed in Phase 21._