---
name: RCDF Design Framework
colors:
  surface: '#faf9fb'
  surface-dim: '#dbd9dc'
  surface-bright: '#faf9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f6'
  surface-container: '#efedf0'
  surface-container-high: '#e9e8ea'
  surface-container-highest: '#e3e2e5'
  on-surface: '#1b1c1e'
  on-surface-variant: '#43474d'
  inverse-surface: '#2f3033'
  inverse-on-surface: '#f2f0f3'
  outline: '#74777e'
  outline-variant: '#c4c6ce'
  surface-tint: '#49607e'
  primary: '#000f22'
  on-primary: '#ffffff'
  primary-container: '#0a2540'
  on-primary-container: '#768dad'
  inverse-primary: '#b0c8eb'
  secondary: '#1b6d24'
  on-secondary: '#ffffff'
  secondary-container: '#a0f399'
  on-secondary-container: '#217128'
  tertiary: '#1a0b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#381d00'
  on-tertiary-container: '#ae835a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2e4ff'
  primary-fixed-dim: '#b0c8eb'
  on-primary-fixed: '#001c37'
  on-primary-fixed-variant: '#314865'
  secondary-fixed: '#a3f69c'
  secondary-fixed-dim: '#88d982'
  on-secondary-fixed: '#002204'
  on-secondary-fixed-variant: '#005312'
  tertiary-fixed: '#ffdcbe'
  tertiary-fixed-dim: '#eebd90'
  on-tertiary-fixed: '#2d1600'
  on-tertiary-fixed-variant: '#613f1c'
  background: '#faf9fb'
  on-background: '#1b1c1e'
  surface-variant: '#e3e2e5'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

The brand personality for this design system is **Professional, Impactful, and Human-Centric**. As an NGO framework, it prioritizes trust and clarity, ensuring that mission-critical information is accessible to donors, partners, and beneficiaries alike. 

The aesthetic follows a **Modern Corporate** style with a focus on:
- **Generous Whitespace:** Utilizing air to reduce cognitive load and emphasize key narratives.
- **Precision:** Clean alignments and consistent grids to reflect organizational reliability.
- **Warmth:** Softening the professional tone through intentional roundedness and human-centric imagery (noted in component guidelines).
- **Accessibility:** High-contrast ratios and clear visual hierarchies are non-negotiable foundations of the interface.

## Colors

The palette is anchored by **Deep Navy Blue**, conveying authority and stability, paired with **Forest Green** to represent growth, sustainability, and the NGO’s mission-driven impact.

- **Primary (#0A2540):** Used for global navigation, primary buttons, and heavy headings.
- **Secondary (#2E7D32):** Used for success states, environmental call-to-outs, and impactful secondary actions.
- **Neutrals:** The background remains a crisp White (#FFFFFF) to maximize legibility. Light Gray/Blue (#F8FAFC) is used strictly for surface layering, such as card backgrounds or section dividers, to provide subtle visual separation without introducing clutter.
- **Text:** Dark Slate is reserved for high-hierarchy information, while Slate Gray provides a softer contrast for metadata and long-form body descriptions.

## Typography

This design system utilizes **Inter** for its exceptional legibility and systematic neutral tone. It is a workhorse typeface that remains professional across all sizes.

- **Headlines:** Use Bold and Semi-Bold weights with slight negative letter-spacing to create a tight, authoritative "news" feel.
- **Body Text:** Standardized at 16px for optimal readability. For dense reporting or data-heavy sections, the 14px `body-sm` should be used.
- **Labels:** Small caps or uppercase with increased tracking should be applied to category labels and overlines to distinguish them from interactive text elements.

## Layout & Spacing

The design system employs a **Fluid-Fixed Hybrid Grid**. 
- **Desktop:** A 12-column grid with a max-width of 1280px. Gutters are fixed at 24px to maintain a clean gutter-to-margin ratio.
- **Tablet:** 8-column grid with 16px gutters and 32px side margins.
- **Mobile:** 4-column grid with 16px gutters and 16px side margins.

**Rhythm:** 
A strictly enforced 4px/8px baseline grid ensures vertical rhythm. Use `lg` (40px) and `xl` (64px) spacing tokens between major sections to emphasize the "generous whitespace" brand pillar.

## Elevation & Depth

To maintain a modern and professional feel, the design system avoids heavy shadows. Instead, it utilizes **Tonal Layers** and **Ambient Depth**:

- **Level 0 (Flat):** Primary background (#FFFFFF).
- **Level 1 (Raised):** Surface-container accent (#F8FAFC) used for sectioning content or subtle inset backgrounds.
- **Level 2 (Floating):** Used for Cards and Modals. These utilize an "Ambient Shadow": `0px 4px 20px rgba(15, 23, 42, 0.08)`. This soft, low-opacity shadow creates separation without the UI feeling "heavy" or dated.
- **Outlines:** Use 1px borders in `#E2E8F0` for form inputs and static cards to ensure structural integrity on the white background.

## Shapes

The shape language is **Refined and Modern**. 
- Standard components (Buttons, Inputs, Cards) use a **0.5rem (8px)** corner radius. This balance avoids the harshness of sharp corners while remaining more professional than a fully pill-shaped aesthetic.
- **Large Components:** Hero images and major containers may use `rounded-xl` (24px) to draw the eye and soften the overall layout.
- **Interactive States:** Focus states should use a 2px offset solid stroke in Primary Navy to ensure accessibility.

## Components

### Buttons
- **Primary:** Deep Navy background, White text. 8px border-radius. High-emphasis actions (e.g., "Donate Now").
- **Secondary:** Forest Green background or Forest Green outline. Used for secondary calls to action (e.g., "Learn More").
- **Ghost:** No background, Slate Gray text. Used for tertiary navigation.

### Inputs & Forms
- **Style:** 1px border (#E2E8F0), 8px corner radius, 16px internal padding.
- **Labels:** Should always be visible above the input (Body-sm, Semi-Bold, Dark Slate).
- **Focus:** 2px solid border in Primary Navy.

### Cards
- **Construction:** Level 2 Ambient Shadow, White background, 16px or 24px internal padding.
- **Content:** Use a clear hierarchy with an image at the top (8px top-radius), followed by a category label, headline, and brief body text.

### Chips/Tags
- **Usage:** Used for "Project Categories" or "Status."
- **Style:** Light Gray/Blue background (#F8FAFC) with Slate Gray text. 100px (Pill) radius to distinguish them from buttons.

### Lists
- Standard vertical lists should use a 1px bottom border separator in `#F1F5F9`.
- Bullet points in mission statements should use a small "Checkmark" icon in Forest Green to reinforce positive impact.

### Navigation
- **Header:** Sticky positioning, White background, subtle bottom border (#F1F5F9).
- **Links:** Dark Slate text, changing to Forest Green on hover with a subtle 2px bottom bar transition.