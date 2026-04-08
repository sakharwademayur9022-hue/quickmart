# Design Brief

## Direction

Urgent & Immediate — A vibrant, mobile-first quick commerce app that prioritizes speed, freshness, and actionable CTAs. Every interaction signals fast delivery and convenient shopping.

## Tone

Friendly yet efficient; playful but purposeful. This is consumer-facing grocery delivery, not corporate. Round edges, bright green primary, warm orange accents, and energetic micro-interactions create an approachable, energetic aesthetic.

## Differentiation

Pulsing cart button with bounce animation; timeline-based order tracking with animated delivery states; micro-interactions on quantity selectors and product cards; floating action patterns for instant cart access.

## Color Palette

| Token          | OKLCH           | Role                                   |
| -------------- | --------------- | -------------------------------------- |
| background     | 0.99 0.008 280  | Off-white base, cool undertones        |
| foreground     | 0.18 0.02 280   | Deep blue-grey text                    |
| card           | 1.0 0.0 0       | Pure white for product/order cards     |
| primary        | 0.52 0.22 150   | Fresh green for growth & produce       |
| primary-fg     | 0.98 0.005 150  | White on primary                       |
| accent         | 0.68 0.18 55    | Warm amber for urgency/CTAs            |
| accent-fg      | 0.18 0.02 55    | Dark on accent                         |
| destructive    | 0.55 0.22 25    | Red for errors/cancellations           |
| border         | 0.9 0.015 280   | Light blue-grey for subtle separation  |

## Typography

- Display: Plus Jakarta Sans — friendly, rounded, all-cap labels and hero headings
- Body: Plus Jakarta Sans — consistent, approachable UI text
- Mono: JetBrains Mono — prices, order IDs, delivery times (precision)
- Scale: Hero `text-5xl font-bold tracking-tight`, H2 `text-3xl font-bold`, Label `text-xs font-semibold uppercase`, Body `text-base`

## Elevation & Depth

Soft, layered shadows. Cards float subtly off the background with `shadow-card` (4px blur); interactive elements elevate on hover with `shadow-elevated` (8px blur). No harsh shadows — the aesthetic is clean, not dramatic.

## Structural Zones

| Zone      | Background          | Border                | Notes                                 |
| --------- | ------------------- | --------------------- | ------------------------------------- |
| Header    | bg-card border-b    | border-border 1px     | White header with search & logo       |
| Content   | bg-background       | —                     | Alternating: white cards, bg-muted    |
| Cart FAB  | bg-primary          | —                     | Floating bottom-right, pulsing        |
| Footer    | bg-muted/40 border-t | border-border 1px     | Links & info                          |

## Spacing & Rhythm

Balanced density: 12px (gutter inside cards), 24px (section gap), 16px (component padding). Breathing room between product cards; grouped address/order info in compact blocks. Section dividers use borders over spacing to reduce bulk.

## Component Patterns

- Buttons: Rounded full pills for primary actions (Add to Cart), rounded-lg for secondary; green primary, orange accent for urgency
- Cards: 12-16px border-radius, white background, subtle shadow on hover, product image thumbnail top
- Badges: Pill-shaped (full border-radius), green for in-stock, amber for low-stock, muted for archived
- Quantity: Stepper (−/+) with inline edit or segmented buttons
- Order status: Timeline with icon/color per state (Confirmed green, In-Transit amber, Delivered primary)

## Motion

- Entrance: Fade + slide up on page load (0.3s ease-out); stagger product cards by 50ms
- Hover: Subtle lift (2px scale-up), shadow elevation, text darkens slightly (0.2s transition-smooth)
- Cart FAB: Continuous pulse (2s cycle) when items present; bounce on new item added (0.6s)
- Decorative: None—focus is on functional micro-interactions, not eye candy

## Constraints

- No dark mode — light theme only for now to match fresh/grocery aesthetic
- No gradient fills — only solid OKLCH colors or subtle opacity shifts
- Max 3 text colors (foreground, muted-foreground, accent-foreground) to avoid chaos
- Rounded corners everywhere (minimum 12px) to maintain friendly tone

## Signature Detail

Pulsing green cart button with bounce animation on item add — signals urgency and immediate action, contrasts with rest of the calm card-based layout.
