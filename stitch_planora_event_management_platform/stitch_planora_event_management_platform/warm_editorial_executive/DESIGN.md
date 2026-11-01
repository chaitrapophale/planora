---
name: Warm Editorial Executive
colors:
  surface: '#fff8f4'
  surface-dim: '#e4d8ce'
  surface-bright: '#fff8f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fef1e7'
  surface-container: '#f9ece2'
  surface-container-high: '#f3e6dc'
  surface-container-highest: '#ede0d6'
  on-surface: '#201a15'
  on-surface-variant: '#414844'
  inverse-surface: '#362f29'
  inverse-on-surface: '#fceee4'
  outline: '#717973'
  outline-variant: '#c1c8c2'
  surface-tint: '#3f6653'
  primary: '#032f1e'
  on-primary: '#ffffff'
  primary-container: '#1d4533'
  on-primary-container: '#88b29b'
  inverse-primary: '#a5d0b8'
  secondary: '#855140'
  on-secondary: '#ffffff'
  secondary-container: '#feb9a4'
  on-secondary-container: '#794737'
  tertiary: '#392313'
  on-tertiary: '#ffffff'
  tertiary-container: '#513827'
  on-tertiary-container: '#c5a18b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c0edd3'
  primary-fixed-dim: '#a5d0b8'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#274e3c'
  secondary-fixed: '#ffdbd0'
  secondary-fixed-dim: '#fab7a1'
  on-secondary-fixed: '#341005'
  on-secondary-fixed-variant: '#693a2b'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#e5bfa8'
  on-tertiary-fixed: '#2b1708'
  on-tertiary-fixed-variant: '#5b412f'
  background: '#fff8f4'
  on-background: '#201a15'
  surface-variant: '#ede0d6'
typography:
  display-lg:
    fontFamily: Newsreader
    fontSize: 48px
    fontWeight: '500'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Newsreader
    fontSize: 34px
    fontWeight: '500'
    lineHeight: 42px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Newsreader
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Newsreader
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Newsreader
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 26px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  title-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system serves event directors, agency producers, and experiential coordinators orchestrating high-stakes events. It reconciles the precision of modern operations software with the tactile warmth of luxury publishing and bespoke stationery.

### Design Principles
- **Editorial Tactility:** Interfaces feel structured like an architectural planner or editorial binder, moving away from sterile SaaS grays into warm parchment and deep botanical tones.
- **High-Velocity Operational Clarity:** Dense operational tools (run-of-show, budgets, talent tracking) remain immediately scannable without visual friction.
- **Accessible Dual-State Contrast:** Every state prioritizes strict WCAG 2.2 AA legibility by pairing dense, dark earthen tones against luminous organic neutrals.
- **Organic Decisiveness:** Solid structural borders, confident serif headline anchors, and purposeful geometric sans body text create an atmosphere of seasoned authority.

## Colors

The palette operates on a four-color baseline grounded in natural earth pigments, supported by surgical crisp white for mission-critical clarity:

- **Primary (`#1D4533` - Forest Green):** The authoritative focal point. Anchors primary calls-to-action, navigation frames, selected statuses, and key operational signals.
- **Secondary (`#5E3122` - Deep Brown):** High-contrast typography, refined micro-headers, structural separator lines, and deep badge text. Replaces pure black to preserve organic warmth.
- **Tertiary (`#F9D2BA` - Peach):** The dynamic accent. Powers contextual highlights, active focus halos, secondary badge fills, and warm warning callouts.
- **Neutral (`#F7EAE0` - Warm Cream):** Foundational canvas substrate, soft nested panels, and secondary card fills. Delivers a tactile, paper-grade baseline.
- **Crisp White (`#FFFFFF`):** Reserved strictly for primary card surfaces requiring elevated optical separation, data entry fields, table rows, and modal dialogs.

### Application Rules
- **Text on Warm Cream:** Always use `#5E3122` for standard copy (contrast ratio 6.9:1) or `#1D4533` (contrast ratio 8.1:1). Never apply low-contrast gray.
- **Text on Primary Forest Green:** Always use `#F7EAE0` or `#FFFFFF`.
- **Borders & Dividers:** Use `#5E3122` at 15% opacity (`rgba(94, 49, 34, 0.15)`) or `#1D4533` at 20% opacity (`rgba(29, 69, 51, 0.20)`).

## Typography

The type system blends editorial gravitas with geometric operational precision:

- **Editorial Headings (`Newsreader`):** Applied to screen titles, major section dividers, and modal introductions. Conveys human craftsmanship, hospitality, and executive polish.
- **Interface & Data Engine (`Plus Jakarta Sans`):** Applied to data grids, microcopy, form controls, navigation, and badges. Its open counters and geometric structure guarantee rapid parsing during live venue operations.
- **Micro-Labels & Metrics:** Set in `label-sm` with slight uppercase tracking (`0.06em`) to clarify metric titles, timestamps, and column headers without overpowering dense data tables.

## Layout & Spacing

The layout is built upon an adaptive 12-column fluid grid system paired with strict 8pt base increments.

### Breakpoints & Adaptive Reflow
- **Desktop (>= 1200px):** 12 columns with 24px gutters and 32px outer canvas margins. Accommodates persistent side navigation, high-density split view run-of-show monitors, and nested budget tables.
- **Tablet (768px - 1199px):** 8 columns with 20px gutters and 24px margins. Navigation collapses to an icon dock or responsive drawer; complex tables unlock horizontal freeze-pane scrolling.
- **Mobile (< 768px):** 4 columns with 16px gutters and 16px canvas margins. Multi-column metric dashboards stack into single-column vertical cards; action bars dock to the bottom viewport edge for one-thumb field accessibility.

### Spatial Rhythm
- **Micro Spacing (`space-xs` to `space-sm`):** Reserved for badge padding, internal input icon margins, and inline status chip alignment.
- **Component Spacing (`space-md` to `space-lg`):** Standard interior padding for high-density cards, lists, prompt dialogs, and table cells.
- **Structural Spacing (`space-xl`):** Canvas segment division and top-level page headers.

## Elevation & Depth

To protect the tactile editorial atmosphere, visual hierarchy avoids artificial drop shadows in favor of tonal surface tiers, layered canvas frames, and warm micro-borders.

### Surface Tiers
- **Tier 0 (Canvas Base):** Warm Cream (`#F7EAE0`). The foundational substrate for all screens.
- **Tier 1 (Surface Cards & Workspaces):** Crisp White (`#FFFFFF`). Utilized for cards, live tables, and actionable surfaces. Delineated by a hairline outline (`1px solid rgba(94, 49, 34, 0.12)`).
- **Tier 2 (Floating Overlays & Menus):** Crisp White (`#FFFFFF`) or Warm Cream with ambient tinted occlusion: `box-shadow: 0 8px 24px -4px rgba(29, 69, 51, 0.08), 0 2px 6px -1px rgba(94, 49, 34, 0.06)`.
- **Tier 3 (Modals & Emergency Drawers):** Crisp White (`#FFFFFF`) framed in `2px solid #1D4533` over a Warm Cream dimming scrim (`rgba(29, 69, 51, 0.45)` backdrop filter blur of 4px).

### The Low-Contrast Structural Border
All cards, containers, and table divisions rely on soft, tinted borders (`rgba(94, 49, 34, 0.12)` or `rgba(29, 69, 51, 0.15)`). This simulates fine-line stationery ruling and eliminates boundary ambiguity.

## Shapes

The system uses refined, architectural radiuses (`roundedness: 1`). Soft, disciplined corners maintain an executive, organized aesthetic without becoming toy-like or overly rounded.

- **Base Radius (0.25rem / 4px):** Applied to form fields, data table rows, inner chips, tooltips, and segment toggles.
- **Medium Radius (0.5rem / 8px):** Applied to primary cards, drop panels, AI interaction dialogue bubbles, and modal frames.
- **Pill (9999px):** Strictly reserved for status tags, event switcher pills, and interactive filter chips to maximize scan speed against rectangular data grids.

## Components

### Buttons
- **Primary:** Forest Green (`#1D4533`) background, Warm Cream (`#F7EAE0`) text, 0.25rem radius. Active state: `#153426`.
- **Secondary:** Transparent background, 1px border in `#1D4533`, Deep Brown (`#5E3122`) text. Hover state: Warm Cream tint (`rgba(247, 234, 224, 0.6)`).
- **Tertiary / Subtle:** Peach (`#F9D2BA`) background, Deep Brown (`#5E3122`) text. Used for contextual AI actions and secondary highlights.

### Event Switcher
- Placed in the top navigation or sidebar header. Combines a Deep Brown label with a pill selector styled in Crisp White (`#FFFFFF`) over the Warm Cream canvas, bordered by `rgba(94, 49, 34, 0.15)`. Shows venue name, date, and live badge status.

### AI Planning Prompt Bubbles
- Built with a soft Peach background (`rgba(249, 210, 186, 0.35)`) and a structured Forest Green left border (`3px solid #1D4533`).
- Contains a dedicated icon indicating AI generation, an editorial serif insight headline, and concise recommendation text paired with direct inline action buttons.

### Status Chips
- Compliant with accessibility standards: never rely solely on color. Every chip pairs a semantic micro-icon (e.g., checkmark, clock, warning triangle) with uppercase text in `label-sm`.
- **Confirmed / Normal:** Forest Green text (`#1D4533`) on Warm Cream (`#F7EAE0`) background with a 1px Forest Green border.
- **Pending / Action Required:** Deep Brown text (`#5E3122`) on Peach (`#F9D2BA`) background.
- **Critical Delay:** White text (`#FFFFFF`) on Deep Brown (`#5E3122`) background with high-visibility icon.

### Form Inputs & Checklists
- **Inputs:** Crisp White background, 1px `#5E3122` border at 20% opacity, 0.25rem radius. Focus state displays a 2px solid `#1D4533` ring with a 2px offset in `#F9D2BA`.
- **Checklists:** Interactive rows with Crisp White cards. Custom checkboxes feature a 2px `#1D4533` boundary that fills solid green with a cream checkmark upon completion, striking through the title in muted `#5E3122`.

### Budgeting Tables & Live Delay Monitors
- **Budgeting Tables:** Alternating rows of Crisp White and subtle Warm Cream. Numeric fields are right-aligned using tabular figures for exact vertical digit alignment. Column headers use uppercase `label-sm` in Deep Brown.
- **Live Delay Monitor:** High-contrast persistent notification banner with Deep Brown (`#5E3122`) background and Peach (`#F9D2BA`) typographic accents, displaying live minute offsets and instantaneous re-routing actions for floor staff.