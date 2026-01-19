# Design System Style Guide

This is the comprehensive style guide for the meal planner application. All screens and components must be built according to these rules.

## 1. Visual DNA

**Premium, minimal, modern, cool.** The UI is overwhelmingly black text on white with huge restraint elsewhere. Secondary hues appear rarely (monochrome first).

### Core Principles

- **Monochrome First**: Black text on white backgrounds as foundation
- **One Accent**: Cobalt "Safety Blue" (#276EF1) reserved for selections, focus, active states, and key interactive highlights—used sparingly
- **Typography as Pillar**: Prefer Euclid Circular B; fallback to clean, neutral UI sans (system stack)
- **Disciplined Iconography**: Outline icons on 24×24 grid with bold (~3px) stroke
- **Purposeful Motion**: Quick and purposeful, never flashy. Sheets/dialogs use quintic ease-out

## 2. Design Tokens

All design tokens are defined in `frontend\app\globals.css` and wired into Tailwind + shadcn.

### Core Palette

- **Canvas Background**: `#fff`
- **Surface Background**: `#fff`
- **Primary Text**: `#000`
- **Secondary Text**: `#3E3E3E`
- **Hairline Stroke**: `#E5E5E4`

### Interaction Colors

- **Accent (Safety Blue)**: `#276EF1` - moment-of-interaction only
- **Success**: `#05A357` - use very sparingly
- **Warning**: `#FFC043` - use very sparingly
- **Error**: `#E11900` - borders/icons only; never long text

### Critical: Safety Blue Usage Rules

**Safety Blue is NOT for selected state backgrounds.** It's reserved for:

✅ **When TO use Safety Blue:**

- Focus rings (`focus:ring-accent`)
- Text color for active navigation items (`text-accent`)
- Small accent indicators (dots, underlines)
- Icon color when selected/active

❌ **When to use MONOCHROME instead:**

- **Selected button backgrounds** → Use `bg-foreground text-white` (black/white)
- **Active tab backgrounds** → Use `bg-foreground text-white` (black/white)
- **Pressed states** → Use monochrome, never colored backgrounds
- **Any large colored areas** → Violates "monochrome first" principle

**Rule of thumb**: If it's larger than an icon or line, use monochrome (black/white/grey).

### Spatial System (8pt with 4pt micro)

- Base: 0px, 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 56px, 64px

### Border Radius (subtle)

- XS: 4px, SM: 6px, MD: 8px, LG: 12px

### Elevation (prefer borders; shadows minimal)

- Shadow 1: `0 1px 2px rgba(0,0,0,.06)`
- Shadow 2: `0 2px 8px rgba(0,0,0,.08)`
- Shadow 3: `0 8px 24px rgba(0,0,0,.12)`

### Typography Scale (mobile-first)

- **Display**: 28px/1.1/700
- **Title**: 22px/1.2/600
- **Subtitle**: 18px/1.3/600
- **Body**: 16px/1.5/400
- **Secondary**: 14px/1.4/400
- **Caption**: 12px/1.3/400

## 3. Layout System

### Size Classes

- **Compact (≤600px)**: Single column, bottom actions/nav, sheets for secondary flows
- **Medium (600–1024px)**: Nav rail or collapsible sidebar; master–detail when useful
- **Expanded (≥1024px)**: Persistent sidebar + top bar + main + secondary panel

### Containers & Rhythm

- **Content Max-Width**: 720px for primary reading
- **Gutters**: Compact px-4 (16px), Medium px-6 (24px), Expanded px-8 (32px)
- **Vertical Rhythm**: Default gaps gap-4/6; section spacing my-8/12
- **Separation**: Use whitespace and hairline borders, not big shadows

## 4. Component Guidelines

### Buttons

- **Primary**: Black background, white text, medium font weight
- **Secondary (Outline)**: White background, black text, black border
- **Tertiary (Ghost)**: Black text, underline on hover
- **Selected State**: `bg-foreground text-white` (black background, white text)
- **Focus**: Visible ring with accent color (`focus:ring-accent`)
- **Disabled**: 50% opacity, no pointer events

**Important**: Selected buttons use monochrome (black/white), NOT Safety Blue backgrounds.

### Inputs

- **Base**: White background, black text, hairline border, 48px height
- **States**: Hover lightens border, focus adds accent ring
- **Validation**: Color the border/icon, keep text black

### Navigation

- **Top Bar**: White background, hairline bottom border, black text
- **Bottom Bar**: White background, hairline top border, 24px icons; selected items use `text-accent` (Safety Blue text)
- **Sidebar**: White surface; selected items use black background (`bg-foreground text-white`)
- **Tab Navigation**: Selected tabs use black backgrounds, not Safety Blue backgrounds

**Navigation Rule**: Use Safety Blue for **text color only** in bottom nav; use **monochrome backgrounds** everywhere else.

### Cards & Surfaces

- White background, subtle radius, padding 16-24px
- Either hairline border OR subtle shadow (never both)

### Dialogs & Sheets

- White surface, rounded corners, shadow over dark overlay
- Entry motion: quintic ease-out, 200-280ms durations

## 5. Typography Rules

### Font Stack

1. Euclid Circular B (Display/Text) - if available
2. System UI sans (SF Pro/Inter/Roboto)

### Weight Pairings

- Strong heading weight with lighter supporting copy
- Bold↔Regular or Medium↔Light combinations

### Text Color

- Primary text: Black on light surfaces, white on dark surfaces
- Avoid colored body text; use icons/borders for semantic meaning

### Casing

- Sentence case or title case
- **Never** ALL-CAPS for body/UI labels

## 6. Motion & Interaction

### Durations

- **Micro**: 120-180ms
- **List/Nav**: 180-240ms
- **Sheets/Dialogs**: 220-300ms

### Easing

- Standard ease-out for entry
- Quintic ease-out for sheets (recommended)
- Simple ease-in for exit

### Usage

- Animate only state changes & spatial continuity
- No decorative bounces or flashy effects

## 7. Iconography

### Specifications

- **Canvas**: 24×24px
- **Stroke**: ~3px bold, consistent corner radii
- **Color**: Monochrome (black); accent blue only when selected/active
- **Alignment**: Icon optical center with text baseline

### Usage

- Pair with text frequently
- Icons complement, don't replace labels
- Use outline style consistently

## 8. Color Discipline (Strict Rules)

### Primary Palette

- UI is white surfaces with black text
- Accent blue **only** for interactive emphasis (focus, active, selected)

### Secondary Colors

- Success/Warning/Error may color icons/borders or tiny indicators
- **Never** use secondary colors for long text blocks
- Keep paragraphs and labels black

## 9. What NOT to Do

❌ **Avoid These Patterns:**

- Rainbow UI or multi-accent screens
- Coloring paragraphs or long labels for status
- Heavy drop-shadows or glossy gradients
- Decorative animations or bounces
- ALL-CAPS body text or UI labels
- Stretching content beyond 720px reading width

## 10. Implementation Notes

### Tailwind Integration

All tokens are mapped to Tailwind utilities via CSS custom properties. Use semantic class names that reference the design system.

### Component Variants

Use `cva` (class-variance-authority) for component variants:

- **Intent**: primary | secondary | ghost | destructive
- **Size**: sm | md | lg
- **Density**: comfortable | compact

### Focus Management

All focusable components must include: `focus:ring-2 focus:ring-offset-2 focus:ring-accent`

### Responsive Design

Follow mobile-first approach with progressive enhancement for larger screens.
