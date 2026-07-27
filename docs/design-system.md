# Design System — Kimty's Collection

## Colour Tokens
| Token | Hex | Usage |
|---|---|---|
| primary | #2563EB | Primary buttons, active nav, links |
| primary-hover | #1D4ED8 | Hover / pressed states |
| primary-light | #EFF6FF | Panels, highlights, section backgrounds |
| primary-border | #BFDBFE | Borders on light-blue panels |
| gray-900 | #111827 | Headings, key text |
| gray-600 | #4B5563 | Body text |
| gray-400 | #9CA3AF | Muted text, placeholders |
| gray-200 | #E5E7EB | Card and input borders |
| gray-50 | #F9FAFB | Subtle surfaces (footer, admin body) |
| success / warning / danger | #16A34A / #D97706 / #DC2626 | Status feedback only |

## Typography
Single family: Inter (variable, self-hosted).
H1 30px · H2 24px · H3 18px — all semibold. Body 16px, Small 14px, Caption 12px. Buttons and nav 14px medium.

## Spacing
8-point grid: 8/16/24/32/48/64px. Sections 48–64px apart; card padding 16–24px.

## Radius
6px inputs & badges · 8px buttons & cards (default) · 12px modals · full for pills.

## Shadows
`shadow-sm` cards · `shadow-md` hover, dropdowns, modals. Nothing heavier.

## Breakpoints
640 / 768 / 1024 / 1280. Container max 1280px, centred.

## Buttons
primary · secondary · outline · ghost · danger. Heights 32/40/48. All have focus ring, disabled (50% opacity) and loading states.

## Form Rules
Label above field, required `*`, 40px height, blue focus ring, red border + 13px message on error, entered data retained on validation failure.

## Implemented Components (Phase 3)
Button, Input, Select, Textarea, Checkbox, Badge, Spinner, Modal, Toast, EmptyState — preview at `/design-system` during development.