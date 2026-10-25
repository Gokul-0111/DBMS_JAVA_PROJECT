---
name: ParkEase Systems
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#002113'
  on-tertiary-container: '#009668'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.06em
  label-ui:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1.5rem
  margin-lg: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system is tailored for an institutional-grade, highly operational smart parking management console. The product demands an architectural balance between real-time spatial awareness, rigorous data density, and effortless visual parsing suitable for immediate kiosk operators, facility managers, and academic evaluation.

### Personality & Demeanor
- **Operational Precision:** Information is structured with zero ambiguity. Critical status signals (Occupied, Available, Reserved, Out-of-Service) are parsed in milliseconds.
- **Architectural Utility:** A clean, structural visual language emphasizing clarity, disciplined grid layouts, and deliberate typographic contrast.
- **Technical Rigor:** Monospaced data displays for license plates, RFID serials, and transaction ticket IDs grant the interface a robust, software-engineered demeanor.

### Design Aesthetic
The visual style draws from modern engineering dashboards and data-dense productivity tools: crisp white surface cards elevated over a muted slate foundation, ultra-refined borders, micro-radii, and precise tonal status chips.

## Colors

The color palette reinforces immediate comprehension of occupancy and transit flow while preventing visual fatigue during extended operational monitoring.

### Functional Roles
- **Primary Navy (`#0F172A` / `#1E293B`):** Governs foundational navigation, persistent structural anchors, prominent table headers, and high-emphasis display type.
- **Electric Slate (`#2563EB`):** Directs active focus, interactive commands, vehicle check-in triggers, and primary selection states.
- **Status Available (`#10B981`):** Applied to vacant parking stalls, positive capacity deltas, and automated entry validations. Paired with soft tint `#ECFDF5`.
- **Status Occupied (`#EF4444`):** Flags occupied spaces, active timer thresholds, and immediate clearance blocks. Paired with soft tint `#FEF2F2`.
- **Status Warning & Capacity Alert (`#F59E0B`):** Marks nearing zone capacity, maintenance locks, and rate tier transitions. Paired with soft tint `#FFFBEB`.
- **Canvas & Structural Tones:** Canvas runs on cool slate neutral `#F8FAFC`, cards and modals rest on `#FFFFFF`, and structural boundaries are enforced by `#E2E8F0`.

## Typography

The typography couples geometric clarity with technical utility.

- **Primary UI Type (Plus Jakarta Sans):** Handles headlines, metrics, navigational architecture, and standard copy. Its high x-height and sharp terminals ensure high legibility on standard LCD monitors and dashboard projections.
- **Technical Engine (JetBrains Mono):** Reserved strictly for vehicle registration plates, RFID tokens, parking ticket IDs, bay identification codes (`BAY-A12`), and numerical currency logs.
- **Rule of Restraint:** Monospace text must never be used for standard descriptive labels or prose. It serves purely as an identifiable badge format for systemic tracking strings.

## Layout & Spacing

The layout is built for expansive desktop monitoring environments (optimized for 1280px to 1920px viewports).

### Spatial Blueprint
- **Global Structure:** A fixed left navigation panel (240px) pinned to a fluid operational canvas.
- **Grid Structure:** 12-column dynamic grid system with `gutter-lg` (24px) for dashboard analytical widgets, collapsible to `gutter` (16px) for data tables and compact spatial slot layouts.
- **Slot Grid Matrix:** Parking slot grids follow an 8-bay cluster rhythm separated by a bidirectional access lane equivalent to `space-xl` (32px).
- **Dual-Slot Heavy Vehicle Binding:** Two consecutive vertical or horizontal stalls merge visually via dashed bounding corridors with a dedicated span bracket to denote heavy freight and bus parking.

## Elevation & Depth

This system avoids muddy drop shadows, utilizing low-contrast structural outlines and subtle ambient separation to optimize contrast and rendering speed.

### Surface Tiers
- **Canvas Base (`#F8FAFC`):** The foundational substrate across all administrative layouts.
- **Container Level 1 (`#FFFFFF`):** High-density functional cards, slot inspection panels, and log tables. Outlined with a continuous 1px border of `#E2E8F0`. Shadow is strictly ambient: `0 1px 3px 0 rgba(15, 23, 42, 0.05)`.
- **Interactive Hover State:** Surfaces elevate slightly on hover using `0 4px 6px -1px rgba(15, 23, 42, 0.08)` while the perimeter border shifts to `#CBD5E1`.
- **Overlay & Modal Level 2 (`#FFFFFF`):** Check-in modals, ticket print dialogs, and configuration drawers use a 1px border of `#CBD5E1` combined with a clean multi-stop shadow: `0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)`.
- **Canvas Backdrops:** Overlays dim the interface with a semi-opaque backdrop of `#0F172A` at 40% opacity with no heavy blur filters.

## Shapes

The interface balances sharp technological precision with human usability through clean, controlled curvatures.

### Radius Assignments
- **Control Inputs & Buttons:** Roundedness level 2 (8px / `0.5rem`). Delivers clear target identification without appearing toy-like.
- **Structural Cards & Panels:** Standardized to `rounded-lg` (16px / `1rem`). Softens the macro boundaries of the dashboard layout.
- **Technical Registration Plates & Ticket IDs:** Enclosed within compact `rounded` (4px / `0.25rem`) badges with 1px internal border offsets to emulate physical metal plates and printed vouchers.
- **Parking Stall Cells:** 8px internal corners with a 2px top or left accent bumper bar indicating vehicle approach orientation.

## Components

### Buttons
- **Primary:** Background `#2563EB`, text `#FFFFFF`, font weight 600. Hover: `#1D4ED8`. Focus outline: 2px offset with `#93C5FD`.
- **Secondary / Action Navy:** Background `#0F172A`, text `#FFFFFF`. Used for master administrative overrides and final checkout confirmation.
- **Subtle / Ghost:** Transparent background, text `#475569`, border 1px solid `#E2E8F0`. Hover: `#F1F5F9`.

### Status Badges & Vehicle Chips
- **Occupied Chip:** Border `#FCA5A5`, surface `#FEF2F2`, text `#B91C1C`. Displays slot number plus active duration.
- **Available Chip:** Border `#6EE7B7`, surface `#ECFDF5`, text `#047857`. Displays slot designation and vehicle clearance category.
- **Reserved / Warning:** Border `#FCD34D`, surface `#FFFBEB`, text `#B45309`.
- **Registration Plate Display:** Dark or light mode inset plate styling. Font `label-mono`, surface `#F1F5F9`, border 1px solid `#CBD5E1`, text `#0F172A`, padded with 2px vertical by 6px horizontal.

### Parking Slot Grid Cells
- Dimensions: minimum 84px width by 120px height for desktop viewports.
- Contains three distinct zones:
  1. Top utility bar: slot identifier (e.g., `P-104`) in `label-ui` and category icon.
  2. Center core: vehicle occupancy visual or available pulse ring.
  3. Bottom meta bar: elapsed dwell time or registration number chip.
- **Consecutive Truck / Heavy Vehicle Grouping:** Two vertically adjacent slots bound together by a continuous 2px dashed outline `#94A3B8`, removing the dividing partition line and displaying a unified spanned identifier badge (e.g., `TRK-01 [BAY 11-12]`).

### Data Tables (Live Vehicle Manifest)
- Rows: compact 44px vertical height, divided by 1px solid `#F1F5F9`.
- Headers: `#F8FAFC` background, text `#475569`, uppercase 11px font weight 700 with letter spacing `0.05em`.
- Zebra striping is omitted in favor of clear hover highlighting (`#F8FAFC`).

### Input Fields & Search Bars
- Background `#FFFFFF`, border 1px solid `#CBD5E1`, height 40px, padding horizontal 12px.
- Focus: border color `#2563EB` with a crisp `0 0 0 3px rgba(37, 99, 235, 0.15)` ring.
- Quick Search accepts monospace plate lookups with automatic uppercase transformation.