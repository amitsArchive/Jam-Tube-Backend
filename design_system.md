---
name: Late Night Neon
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
  on-surface-variant: '#baccb0'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#85967c'
  outline-variant: '#3c4b35'
  surface-tint: '#2ae500'
  primary: '#efffe3'
  on-primary: '#053900'
  primary-container: '#39ff14'
  on-primary-container: '#107100'
  inverse-primary: '#106e00'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
  tertiary: '#eaffea'
  on-tertiary: '#003919'
  tertiary-container: '#65f897'
  on-tertiary-container: '#007038'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#79ff5b'
  primary-fixed-dim: '#2ae500'
  on-primary-fixed: '#022100'
  on-primary-fixed-variant: '#095300'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#6bfe9c'
  tertiary-fixed-dim: '#4ae183'
  on-tertiary-fixed: '#00210c'
  on-tertiary-fixed-variant: '#005228'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 64px
    fontWeight: '900'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '800'
    lineHeight: '1.2'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  button-text:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

This design system is built for an immersive, high-energy collaborative music experience. The brand personality is electric and nocturnal, designed to evoke the feeling of a private listening session in a high-end digital lounge.

The design style utilizes **Glassmorphism** and **High-Contrast Neon** accents. It relies on deep, obsidian-like surfaces layered with frosted translucent panels to create a sense of depth and focus. Accents are used sparingly but with maximum impact to guide users through the rhythmic energy of the interface. The emotional response should be one of "controlled intensity"—professional enough for audio management, yet vibrant enough for a party atmosphere.

## Colors

The palette is strictly nocturnal. The primary background is a deep charcoal/black to minimize eye strain during late-night use and to allow the music content to pop. 

- **Primary Neon:** Used for call-to-actions, play states, and active track indicators. It should always be used at full saturation.
- **Surface Palette:** Layers are built using variations of charcoal and translucent overlays. 
- **Functional Colors:** Success states utilize the primary neon green, while warnings utilize a high-contrast magenta to maintain the "Neon" aesthetic without breaking the nocturnal theme.

## Typography

The typography strategy focuses on hierarchy through weight and character. 

- **Headlines:** Montserrat is used in heavy weights (Bold/Black) to mimic the impact of concert posters and vinyl covers.
- **Body:** Hanken Grotesk provides a modern, clean, and highly legible experience for track listings and chat messages.
- **Utility:** JetBrains Mono is strictly reserved for session codes, timestamps, and technical data, reinforcing the "engineered" feel of the audio platform.

## Layout & Spacing

This design system employs a **Fluid Grid** model with generous safe areas to maintain an "immersive" feel. 

- **Desktop:** 12-column grid with a maximum content width of 1440px. Gutters are kept wide (24px) to allow the glassmorphic background blurs to be visible between components.
- **Mobile:** 4-column grid with tight margins.
- **Spacing Logic:** All spacing is based on an 8px base unit. Component internal padding should favor "MD" (24px) for a spacious, premium feel.

## Elevation & Depth

Depth is achieved through **Glassmorphism** and **Outer Glows** rather than traditional shadows.

1.  **Base Layer:** Solid #0A0A0A.
2.  **Surface Layer:** Semi-transparent white (5-8% opacity) with a 20px backdrop blur. This layer is used for sidebars and secondary panels.
3.  **Active Layer:** Elements that are interactive or "above" the surface use a 1px border with 15% opacity white.
4.  **Accent Elevation:** Primary buttons and active indicators feature a soft 15px-25px outer glow using the primary neon green (#39FF14) at 30% opacity, making them appear as if they are light sources.

## Shapes

The shape language is organic and soft to contrast against the sharp neon colors and monospaced type. 

- **Standard Containers:** Use 16px (rounded-lg) for cards and main UI panels.
- **Interactive Elements:** Buttons and input fields use 12px.
- **Avatars/Indicators:** Use full pill-shapes or circles to denote people and active status.
- **Visual Rhythm:** Avoid sharp 90-degree corners entirely to maintain the "liquid" and energetic feel of the brand.

## Components

### Buttons
- **Primary:** Background #39FF14, text #0A0A0A (Montserrat Bold). Feature a subtle neon glow on hover.
- **Secondary:** Glassmorphic background (10% white), white text, 1px white border (20% opacity).

### Cards / Panels
- Cards must use the glassmorphic treatment: `backdrop-filter: blur(20px)` and a background of `rgba(255, 255, 255, 0.05)`.
- A 1px subtle top-highlight border is required to separate stacked cards.

### Input Fields
- Dark backgrounds (#1A1A1A) with a 1px border that turns Neon Green on focus.
- Labels use JetBrains Mono for a technical, precise look.

### The "Now Playing" Bar
- A persistent, full-width footer component.
- Uses a more intense backdrop blur (40px) to ensure the player controls remain legible over scrolling album art.
- The progress bar is a 4px thick neon green line with a trailing glow.

### Session Chips
- Used for tags like "Genre" or "Vibe."
- Rounded-full (pill-shaped) with a 1px neon green border.
