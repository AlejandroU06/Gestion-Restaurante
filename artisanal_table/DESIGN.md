---
name: Artisanal Table
colors:
  surface: '#fff8f3'
  surface-dim: '#e0d9d3'
  surface-bright: '#fff8f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf2ec'
  surface-container: '#f4ede6'
  surface-container-high: '#eee7e1'
  surface-container-highest: '#e8e1db'
  on-surface: '#1e1b17'
  on-surface-variant: '#57423a'
  inverse-surface: '#33302c'
  inverse-on-surface: '#f7efe9'
  outline: '#8a7268'
  outline-variant: '#dec0b5'
  surface-tint: '#a14009'
  primary: '#9f3e07'
  on-primary: '#ffffff'
  primary-container: '#c05621'
  on-primary-container: '#fffeff'
  inverse-primary: '#ffb596'
  secondary: '#586330'
  on-secondary: '#ffffff'
  secondary-container: '#d8e6a6'
  on-secondary-container: '#5c6834'
  tertiary: '#5d5e55'
  on-tertiary: '#ffffff'
  tertiary-container: '#76766d'
  on-tertiary-container: '#fffeff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcd'
  primary-fixed-dim: '#ffb596'
  on-primary-fixed: '#360f00'
  on-primary-fixed-variant: '#7d2d00'
  secondary-fixed: '#dbe9a9'
  secondary-fixed-dim: '#bfcd8f'
  on-secondary-fixed: '#171e00'
  on-secondary-fixed-variant: '#404b1b'
  tertiary-fixed: '#e4e3d7'
  tertiary-fixed-dim: '#c7c7bc'
  on-tertiary-fixed: '#1b1c15'
  on-tertiary-fixed-variant: '#46473f'
  background: '#fff8f3'
  on-background: '#1e1b17'
  surface-variant: '#e8e1db'
typography:
  headline-display:
    fontFamily: Noto Serif
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Noto Serif
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 24px
  margin: 32px
---

## Brand & Style

This design system is built to bridge the gap between high-end hospitality and efficient operational management. The brand personality is welcoming, sophisticated, and grounded, evoking the sensory experience of a well-curated dining room. It avoids the cold, clinical feel of traditional SaaS in favor of a "Warm Minimalist" aesthetic.

The target audience consists of restaurateurs and front-of-house staff who require high-density information without the cognitive load of a cluttered interface. By utilizing tactile-inspired elements and organic tones, the UI creates a calm environment that mirrors the professional yet inviting atmosphere of a modern bistro.

## Colors

The palette is rooted in organic, appetizing tones that suggest fresh ingredients and natural materials.

*   **Primary (Terracotta):** Used for primary actions, critical status alerts, and branding highlights. It provides a warm, vibrant energy that stimulates the appetite.
*   **Secondary (Olive Green):** Used for "Available" statuses, success states, and secondary navigational elements. It balances the warmth of the terracotta with a grounding, calm tone.
*   **Backgrounds:** A tiered system of creams. The base page background uses a soft off-white (`#F9F7F2`), while containers use a richer cream (`#FDFCF0`) to create subtle depth.
*   **Neutrals:** Deep charcoal is used for text rather than pure black to maintain the soft, professional look.
*   **Textures:** Soft wood grain overlays should be used sparingly—primarily on the sidebar or large empty-state headers—to reinforce the tactile "physical restaurant" metaphor.

## Typography

This design system employs a sophisticated typographic pairing to balance editorial elegance with functional clarity.

**Headings (Noto Serif):** Used for page titles, menu category headers, and high-level summaries. The serif adds a premium, "menu-like" feel that distinguishes this application from generic management tools.

**Interface Elements (Plus Jakarta Sans):** Chosen for its soft terminals and high readability at small sizes. Use this for all functional UI components, data tables, and body copy. The slightly rounded nature of the font complements the 8px-12px corner radius used across the system.

## Layout & Spacing

This design system utilizes a **Fixed Grid** approach for internal content areas to maintain a structured, professional appearance, while the sidebar remains fluid.

*   **Grid System:** A 12-column grid with 24px gutters.
*   **Spacing Rhythm:** All spacing is based on a 4px baseline. Use 16px (md) for standard padding within cards and 24px (lg) for spacing between major sections.
*   **Density:** For administrative views (e.g., Inventory or Staffing), use "Compact" spacing (8px padding). For customer-facing or high-visibility views (e.g., Table Map or Menu Editor), use "Generous" spacing (24px padding).

## Elevation & Depth

Hierarchy is established through **Ambient Shadows** and **Tonal Layers**. This design system avoids harsh borders, preferring depth to define boundaries.

*   **Level 0 (Base):** The off-white canvas.
*   **Level 1 (Cards/Tables):** A cream background with a very soft, diffused shadow: `0 4px 20px rgba(45, 42, 38, 0.05)`.
*   **Level 2 (Popovers/Modals):** A more pronounced shadow to indicate focus: `0 12px 40px rgba(45, 42, 38, 0.12)`.
*   **Backdrop Blur:** Use a subtle 4px blur behind modals to maintain the "airy" feel of the restaurant environment while ensuring the foreground is legible.

## Shapes

The shape language is defined by "Soft Organicism." 

*   **Standard Components:** Buttons, Input fields, and List items use a **0.5rem (8px)** radius.
*   **Container Elements:** Main cards and modals use a **1rem (16px)** radius to feel approachable and modern.
*   **Table Representations:** Icons representing physical tables in the floor plan should mirror their real-world shapes (circular or rectangular) but always maintain a minimum 4px corner radius to stay consistent with the design system's softness.

## Components

### Buttons
Primary buttons use the Terracotta fill with white text. Secondary buttons use a light Olive Green ghost style (border and text only). All buttons feature a 0.5rem radius and a subtle lift on hover.

### Cards
Cards are the primary container. They must feature a subtle cream background (`#FDFCF0`) to distinguish them from the page background. Headers within cards should use the serif font at a small, bold scale.

### Table Status Icons
A specialized component for the floor plan. 
- **Available:** Solid Olive Green outline with a soft green glow.
- **Occupied:** Solid Terracotta outline.
- **Reserved:** Dashed Deep Charcoal outline.
- **Needs Attention:** Pulsing Terracotta shadow.

### Input Fields
Inputs use a "bottom-border only" or "soft-filled" style rather than a heavy box. The focus state should be a subtle color shift to the primary Terracotta with no heavy outer glow.

### Chips & Badges
Used for order status (e.g., "Appetizer", "Mains", "Paid"). These use high-chroma backgrounds with low-opacity (15%) to keep the UI "light" while providing immediate color-coded recognition.

### Food Imagery
Photos should always have a 12px corner radius and a subtle inner shadow to make them feel "recessed" into the cream containers, as if they are part of a printed menu.