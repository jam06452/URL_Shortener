# Brutalist Cyber Design Style Guide

## Design Philosophy Prompt

When creating interfaces in this style, follow these core principles:

### Visual Language
- **Reject soft aesthetics**: No gradients, blurs, glassmorphism, or subtle shadows
- **Embrace hard edges**: Zero border-radius, sharp corners, aggressive clipping
- **Bold color contrast**: Use pure, saturated colors (cyan #00ffff, magenta #ff00ff, yellow #ffff00) against pure black backgrounds
- **Geometric brutalism**: Grid patterns, asymmetric layouts, intentional visual tension
- **Heavy typography**: Use bold, black, or heavy font weights exclusively. Arial Black, Impact, or similar.

### Layout Principles
- **Asymmetry over balance**: Clip corners, offset elements, break the grid intentionally
- **Layered shadows**: Use offset solid shadows (no blur) in contrasting colors (e.g., 10px cyan shadow, -5px magenta shadow)
- **Visible structure**: Show the grid, expose the framework, make the construction obvious
- **Vertical and horizontal elements**: Mix writing orientations, use sidebars as design features
- **Negative space as a weapon**: Let black space dominate, don't fill every gap

### Color Strategy
- **Primary palette**: Pure black (#000000) background only
- **Accent colors**: Cyan, magenta, yellow - never mixed, always pure
- **White for text**: High contrast white text on dark, or black text on bright accents
- **No gradients**: Color transitions should be hard cuts, not blends
- **Transparency forbidden**: Use solid colors only (except for intentional fade effects on backgrounds)

### Typography
- **All caps for headlines**: SHORTEN, COMPRESS, OUTPUT - assertive language
- **Monospace for data**: Courier New or Consolas for inputs, URLs, code-like content
- **Sans-serif bold for UI**: Arial Black, Impact, or system bold fonts
- **Tight letter spacing**: -0.05em to -0.02em for display text
- **Large scale contrast**: 3rem headings vs 0.7rem labels

### Interactive Elements
- **Physical shadows**: Shadows that collapse/expand on press (translate + shadow change)
- **Hard transitions**: 0.2s max, cubic-bezier(0.23, 1, 0.32, 1) for smoothness
- **Glitch effects**: RGB color separation on hover for text
- **Geometric transforms**: Rotate, skew, clip-path - make shapes interesting
- **Active states matter**: Elements should physically "press" into the page

### Component Patterns

#### Buttons
```
- 3px solid borders in white or cyan
- Offset box shadows (e.g., 5px 5px 0 magenta)
- On hover: transform translate(-2px, -2px) + increase shadow
- On active: transform translate(5px, 5px) + shadow to 0
- Background color slides in from side (::before pseudo-element)
```

#### Input Fields
```
- Monospace font (Courier New)
- 3px solid borders
- Offset shadows that change color on focus
- Labels in all caps with // prefix or >> suffix
- Black or very dark background
```

#### Containers
```
- Clip-path for asymmetric corners (polygon clipping)
- Multiple offset shadows in different colors
- Decorative elements extending beyond bounds (stripes, corners)
- Grid or striped backgrounds
- No padding rounding - keep rectangular
```

### Animation Guidelines
- **Entrance**: Slide from side with slight rotation (slideInLeft)
- **Hover states**: 0.2-0.3s transitions, geometric shifts
- **Glitch effects**: 0.3s rapid RGB separation in multiple layers
- **Avoid**: Fading, scaling up/down, elastic bounces, soft movements

### Background Treatments
- **Grid patterns**: 50px repeating linear gradients in accent colors
- **Large typography**: Huge text (8rem+) at 0.05 opacity, rotating slowly
- **Radial fades**: Mouse-responsive darkness overlay (radial-gradient following cursor)
- **No images**: Geometric shapes and text only

### Anti-Patterns (What NOT to do)
- ❌ Soft shadows (0 20px 60px rgba(...))
- ❌ Border-radius of any kind
- ❌ Glassmorphism (backdrop-filter: blur)
- ❌ Gradient backgrounds (linear-gradient for fills)
- ❌ Pastel or muted colors
- ❌ Centered symmetric layouts
- ❌ Subtle animations (opacity fades, gentle scales)
- ❌ Sans-serif light fonts
- ❌ Smooth rounded UI elements

### Tech Stack Representation
- Show framework/backend visually through color choices
- Use specific accent colors for specific tech (e.g., Elixir = magenta, Supabase = cyan)
- Add small text badges in corners or edges
- Make tech choices part of the visual identity

### Accessibility Notes
While maintaining brutal aesthetics:
- Keep contrast ratios high (cyan on black = excellent)
- Ensure text is always readable (white or accent on black)
- Make interactive areas large enough (min 44px touch targets)
- Provide clear focus states (offset shadows, color changes)

## Example Prompt for AI

"Create a brutalist cyber-style interface with:
- Pure black (#000000) background with cyan (#00ffff) grid pattern overlay (50px squares)
- Asymmetric main container with one clipped corner using clip-path polygon
- Multiple solid offset shadows (no blur): 10px magenta, -5px yellow
- Bold all-caps white typography (Arial Black) for headings
- Cyan, magenta, yellow accent colors only - never mixed
- 3px solid borders on all interactive elements
- Monospace (Courier New) for input fields
- Physical button press animations (shadow collapse on click)
- Glitch hover effect on heading (RGB color separation)
- Zero border-radius throughout
- Offset box shadows that transform on interaction
- Grid lines visible through radial fade following mouse cursor
- No gradients, no blur effects, no soft shadows
- Vertical text for secondary elements (writing-mode: vertical-lr)
- Large rotated watermark text in background at 5% opacity"

## Color Values Reference
```css
--bg-deep: #000000
--bg-surface: #0a0a0a
--cyan: #00ffff
--magenta: #ff00ff
--yellow: #ffff00
--white: #ffffff
--border-width: 3px
```

## Key CSS Patterns
```css
/* Offset Shadow Pattern */
box-shadow: 5px 5px 0 var(--magenta), -3px -3px 0 var(--yellow);

/* Asymmetric Clip */
clip-path: polygon(0 0, calc(100% - 40px) 0, 100% 40px, 100% 100%, 0 100%);

/* Grid Background */
background-image: 
  linear-gradient(var(--cyan) 1px, transparent 1px),
  linear-gradient(90deg, var(--cyan) 1px, transparent 1px);
background-size: 50px 50px;

/* Glitch Effect */
content: attr(data-text);
position: absolute;
animation: glitch 0.3s infinite;
/* Then transform: translate(±2px, ±2px) in keyframes */

/* Physical Press */
button:active {
  transform: translate(5px, 5px);
  box-shadow: 0 0 0 transparent;
}
```

## Typography Scale
- H1: 3rem, font-weight: 900, letter-spacing: -0.05em
- Button: 1.1rem, font-weight: 900, letter-spacing: 0.1em
- Input: 1rem, font-weight: bold, monospace
- Label: 0.7rem, font-weight: 900, letter-spacing: 0.1em

## This Style Is Best For
- Developer tools and technical interfaces
- URL shorteners, API playgrounds, command tools
- Portfolios wanting to stand out
- Projects emphasizing raw functionality over polish
- Crypto/web3 aesthetics
- Retro-futuristic or cyberpunk themes
