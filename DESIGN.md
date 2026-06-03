---
name: Liquid Obsidian
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#e8bcba'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#af8786'
  outline-variant: '#5e3f3e'
  surface-tint: '#ffb3b1'
  primary: '#ffb3b1'
  on-primary: '#680012'
  primary-container: '#ff525c'
  on-primary-container: '#5b000f'
  inverse-primary: '#bf002a'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
  tertiary: '#6ad8cf'
  on-tertiary: '#003734'
  tertiary-container: '#26a198'
  on-tertiary-container: '#00302d'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad8'
  primary-fixed-dim: '#ffb3b1'
  on-primary-fixed: '#410008'
  on-primary-fixed-variant: '#92001e'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#88f5eb'
  tertiary-fixed-dim: '#6ad8cf'
  on-tertiary-fixed: '#00201e'
  on-tertiary-fixed-variant: '#00504b'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
  obsidian-base: '#0A0A0A'
  crimson-vivid: '#FF1A40'
  glass-edge: rgba(255, 255, 255, 0.10)
  crimson-glow: rgba(255, 26, 64, 0.20)
  text-primary: '#FFFFFF'
  text-secondary: rgba(255, 255, 255, 0.60)
typography:
  headline-xl:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: 0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.01em
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.01em
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: 0em
  body-lg:
    fontFamily: Sora
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  body-md:
    fontFamily: Sora
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  label-sm:
    fontFamily: Sora
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 20px
  container-max: 1440px
---

## Brand & Style

The design system is engineered to evoke a "Studio-after-dark" atmosphere—a high-fidelity, premium environment for collaborative music creation. The brand personality is sophisticated, nocturnal, and technologically advanced, targeting professional creators and audiophiles who value focus and immersion.

The visual direction centers on **Glassmorphism** combined with a **Minimalist Dark** aesthetic. By utilizing heavy backdrop blurs, high-contrast crimson accents, and subtle light-refractive borders, the interface feels like a series of illuminated glass panels floating in a deep, obsidian void. The user experience should feel fluid and rhythmic, mimicking the tactile feedback of high-end studio hardware.

## Colors

The palette is anchored by **Deep Obsidian Black (#0A0A0A)**, providing a void-like canvas that eliminates visual noise. The primary driver is **Crimson Red (#FF1A40)**, used sparingly for critical interactions, status indicators, and energetic accents.

Depth is achieved not through varied hues, but through **transparency and layering**. 
- **Surfaces:** Use translucent variants of the secondary color with `backdrop-filter: blur(40px)`.
- **Reflections:** 1px solid borders using `glass-edge` create the "liquid glass" definition.
- **Atmosphere:** Subdued crimson radial gradients should be positioned behind primary glass panels at 5-10% opacity to simulate ambient studio lighting.

## Typography

The design system exclusively utilizes **Sora** to maintain a modern, geometric, and technical feel. Typography is treated as a structural element. 

- **Headlines:** Set in Bold with increased tracking (letter spacing) to enhance the premium, editorial look.
- **Body:** Optimized for legibility against dark backgrounds, using generous line heights to prevent "halo" eye strain.
- **Labels:** Small, all-caps labels with high tracking are used for metadata and technical specs, mimicking the labeling on professional audio mixers.

## Layout & Spacing

This design system employs a **Fluid Grid** model based on an 8px base unit. Layouts should prioritize negative space to allow the "liquid glass" panels to breathe and overlap without feeling cluttered.

- **Desktop:** 12-column grid with 24px gutters. Content should be centered with a maximum width of 1440px.
- **Tablet:** 8-column grid with 20px gutters.
- **Mobile:** 4-column grid with 16px gutters and 20px side margins.

Spacing between functional groups should be large (64px+) to reinforce the minimalist, premium feel. Related elements within a glass panel should use tight spacing (8px, 16px) to maintain grouping.

## Elevation & Depth

Elevation is conveyed through **refraction and translucency** rather than traditional drop shadows.

1.  **Base Layer:** Solid Obsidian Black (#0A0A0A).
2.  **Atmospheric Layer:** Subtle Crimson radial gradients (200px - 600px radius) with 5% opacity, placed behind glass elements to suggest depth.
3.  **Surface Layer:** Semi-transparent panels (`rgba(26, 26, 26, 0.6)`) with `backdrop-filter: blur(32px)`.
4.  **Edge Layer:** Every elevated panel must have a 1px "Reflective" border. Use `white/10` for top/left edges and `crimson/20` for bottom/right edges to simulate a directional light source.

Interactive elements (active states) increase the brightness of the inner glow and the intensity of the backdrop blur.

## Shapes

The shape language is **Rounded (Level 2)**, striking a balance between the precision of professional software and the approachability of a consumer music platform.

- **Standard Elements:** 0.5rem (8px) radius for buttons and input fields.
- **Panels & Cards:** 1rem (16px) radius for primary glass containers.
- **Large Containers:** 1.5rem (24px) for major sections like sidebar or main feed wraps.

Consistent roundedness is critical to maintain the "liquid" aesthetic; sharp corners should be avoided entirely to keep the interface feeling smooth and high-fidelity.

## Components

### Buttons
- **Primary:** Solid Crimson Red with a `0 0 20px rgba(255, 26, 64, 0.4)` outer glow. Text is white/bold.
- **Secondary (Glass):** Translucent background with a `white/10` border and `backdrop-blur-md`.

### Input Fields
- High-contrast Obsidian backgrounds with a `white/10` border that transitions to `crimson-vivid` on focus.
- Placeholder text should be `white/30`.

### Glass Panels (Cards)
- Use the layering logic defined in Elevation. 
- Content inside panels should have a 24px padding to prevent text from touching the refractive edges.

### Chips & Tags
- Small, pill-shaped elements with a `crimson/10` fill and `crimson-vivid` text. 
- Used for genres, tags, or "Live" indicators.

### Progress Bars & Sliders (Music Player)
- **Track:** `white/10` solid line.
- **Progress:** `crimson-vivid` with a subtle glow at the playhead.
- **Playhead:** A 12px white circle with a 1px crimson stroke.