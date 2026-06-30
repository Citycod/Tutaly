# 03 — Colour System
**Tutaly Design System** | Emotion, hierarchy, and meaning through colour.

> Colour on Tutaly communicates four things simultaneously: brand, meaning, state, and hierarchy. Every colour decision must serve at least one of these purposes.

---

## The Logo Mark

Tutaly's logo is four vertical bars in the brand colours, each rendered as a gradient fading toward transparency, paired with the "Tutaly" wordmark in a light-weight, rounded sans-serif (Inter Light/Regular). Two official versions exist:

| Version | Background | File |
|---------|-----------|------|
| Light-mode mark | White / `#FFFFFF` | `tutaly-logo-light.png` |
| Dark-mode mark | Charcoal / `#1A1C1E` | `tutaly-logo-dark.png` |
| Icon-only mark | Transparent | `tutaly-icon-mark.png` (bars only, no wordmark — use for favicon, app icon, compact nav) |

### Bar Gradient Directions (sampled from source file)

Each bar fades toward transparent in an alternating rhythm — this alternation is a deliberate part of the mark and must be preserved in any reproduction:

```
Bar 1 (Red):   transparent → #CC2B2B   (fades IN top to bottom)
Bar 2 (Green): #1D9E63 → transparent   (fades OUT top to bottom)
Bar 3 (Blue):  transparent → #0048A9   (fades IN top to bottom)
Bar 4 (Gold):  #EACC53 → transparent   (fades OUT top to bottom, peak near top)
```

```css
.logo-bar-red {
  background: linear-gradient(180deg, transparent 0%, #CC2B2B 100%);
}
.logo-bar-green {
  background: linear-gradient(180deg, #1D9E63 0%, transparent 100%);
}
.logo-bar-blue {
  background: linear-gradient(180deg, transparent 0%, #0048A9 100%);
}
.logo-bar-gold {
  background: linear-gradient(180deg, #EACC53 0%, transparent 100%);
}
```

**Do not flatten these to solid fills.** The gradient and alternating direction is the signature visual element of the Tutaly mark — it reads as movement and rhythm, distinct from a generic four-color block.

### Logo Usage Rules

| ❌ Never | ✓ Instead |
|---------|----------|
| Recolor the wordmark | Wordmark is always white (dark bg) or black (light bg) — never brand-colored |
| Use the light-mode mark on dark surfaces | Always use the dark-mode mark on `--bg-canvas` and `--bg-surface` |
| Stretch or skew the mark | Maintain aspect ratio at all times |
| Add a background plate behind the bars | Bars sit directly on the page background |
| Use the wordmark without the bar mark in primary contexts | Icon-only mark is reserved for favicon / compact spaces only |

---

## The Four Brand Pillars

Tutaly's brand identity rests on four colours. Each has a purpose beyond aesthetics.

| Colour | Hex | Role | Emotion |
|--------|-----|------|---------|
| 🔴 **Red** | `#CC2B2B` | Danger, alerts, urgency markers | Action required, critical |
| 🟢 **Green** | `#1D7A3A` | Success, growth, active, Nigeria-resonant | Trust, go, achievement |
| 🔵 **Blue** | `#1B4F9E` | Primary actions, links, trust | Reliability, depth, professionalism |
| 🟡 **Gold** | `#C9A227` | Premium, achievement, highlights | Distinction, aspiration, quality |
| ⬛ **Charcoal** | `#1A1C1E` | Base canvas | Authority, sophistication, focus |

**These are permanent. They do not change for any module, theme, or season.**

---

## Full Colour Palette

### Brand Blue — Primary Action Colour

```
Blue 300:  #3A7DE0   (Hover states, active links)
Blue 400:  #2262C2   (Light hover variant)
Blue 500:  #1B4F9E   ← BASE  (Primary CTAs, focused inputs, links)
Blue 600:  #143D7A   (Active/pressed state)
Blue 700:  #0E2D5C   (Dark text on light surfaces — rare)
```

### Brand Green — Success & Growth

```
Green 300:  #2DB85A   (Success badges, positive indicators)
Green 400:  #24994A   (Success hover)
Green 500:  #1D7A3A   ← BASE  (Success states, active pills, positive data)
Green 600:  #155C2B   (Success pressed)
Green 700:  #0E3D1C   (Dark success text — rare)
```

### Brand Red — Danger & Urgency

```
Red 300:  #F05050   (Error badges, warning text)
Red 400:  #E03B3B   (Error hover)
Red 500:  #CC2B2B   ← BASE  (Errors, delete actions, alerts)
Red 600:  #A82020   (Error pressed)
Red 700:  #7A1515   (Dark error text — rare)
```

### Brand Gold — Premium & Achievement

```
Gold 300:  #F0CC55   (Light gold badge background tint)
Gold 400:  #DDB630   (Gold hover)
Gold 500:  #C9A227   ← BASE  (Premium badges, ratings, achievements)
Gold 600:  #A8851E   (Gold pressed)
Gold 700:  #7A6015   (Dark gold text — rare)
```

### Neutral Charcoal — Surfaces & Text

```
Charcoal 900:  #1A1C1E   ← Canvas (Page background)
Charcoal 800:  #22252A   ← Surface (Cards, sidebars)
Charcoal 700:  #2C3038   ← Elevated (Modals, dropdowns)
Charcoal 600:  #383D47   ← Border Subtle
Charcoal 500:  #4A5060   ← Border Default / Disabled
Charcoal 400:  #6B7280   ← Muted text, placeholder
Charcoal 300:  #9CA3AF   ← Secondary text
Charcoal 200:  #D1D5DB   ← Primary body text
Charcoal 100:  #F3F4F6   ← Headings / High-contrast text
White:         #FFFFFF   ← On-brand overlays
```

---

## Semantic Colour Usage Map

### Surface Colours

| Token | Value | When to Use |
|-------|-------|-------------|
| `--bg-canvas` | Charcoal 900 | Page root background |
| `--bg-surface` | Charcoal 800 | Cards, content panels |
| `--bg-elevated` | Charcoal 700 | Modals, dropdowns, popovers |
| `--bg-glass` | rgba(34,37,42,0.72) | Glass morphism cards |
| `--bg-overlay` | rgba(26,28,30,0.85) | Modal backdrops |

### Text Colours

| Token | Value | When to Use |
|-------|-------|-------------|
| `--text-primary` | Charcoal 100 | Headings, key labels |
| `--text-secondary` | Charcoal 300 | Body copy, descriptions |
| `--text-muted` | Charcoal 400 | Captions, placeholder |
| `--text-disabled` | Charcoal 500 | Disabled field text |

### Status Colours

| Semantic Token | Hex | Use Case |
|---------------|-----|----------|
| `--color-success` | `#1D7A3A` | Success banner, confirmed state |
| `--color-success-bg` | `rgba(29,122,58,0.12)` | Success banner background tint |
| `--color-danger` | `#CC2B2B` | Error state, destructive action |
| `--color-danger-bg` | `rgba(204,43,43,0.12)` | Error input background tint |
| `--color-warning` | `#C9A227` | Warning state, required fields |
| `--color-warning-bg` | `rgba(201,162,39,0.12)` | Warning background tint |
| `--color-info` | `#1B4F9E` | Info banners, tooltips |
| `--color-info-bg` | `rgba(27,79,158,0.12)` | Info background tint |

---

## Module-Specific Colour Accents

Each module gets a primary accent rooted in the brand palette:

| Module | Primary Accent | Accent Use |
|--------|---------------|-----------|
| **Job Board** | Blue `#1B4F9E` | Apply buttons, active filters, search bar |
| **Salary Intelligence** | Green `#1D7A3A` | Salary figures, percentile bars, growth indicators |
| **Company Reviews** | Gold `#C9A227` | Star ratings, score displays, trust badges |
| **Marketplace** | Blue `#1B4F9E` | Buy buttons, product highlights |
| **Connect (Feed)** | Blue `#1B4F9E` | Follow button, connection CTA |
| **Advertising** | Gold `#C9A227` | Campaign metrics, premium feature flags |
| **Employer Dashboard** | Blue `#1B4F9E` | Job posting CTAs, applicant pipeline |

---

## Colour Contrast Requirements

Tutaly targets **WCAG AA compliance minimum** on all text-surface pairings.

| Text | Background | Ratio | Status |
|------|-----------|-------|--------|
| Charcoal 100 (#F3F4F6) on Charcoal 900 (#1A1C1E) | Page bg | 14.5:1 | ✅ AAA |
| Charcoal 300 (#9CA3AF) on Charcoal 800 (#22252A) | Card bg | 6.2:1 | ✅ AA |
| White (#FFF) on Blue 500 (#1B4F9E) | Button | 7.1:1 | ✅ AA |
| White (#FFF) on Green 500 (#1D7A3A) | Success | 5.4:1 | ✅ AA |
| Charcoal 900 (#1A1C1E) on Gold 500 (#C9A227) | Warning badge | 8.3:1 | ✅ AA |
| White (#FFF) on Red 500 (#CC2B2B) | Error | 5.9:1 | ✅ AA |

---

## Colour Don'ts

| ❌ Never | ✓ Instead |
|---------|----------|
| Use white backgrounds (`#FFFFFF`) as page canvas | Use `--bg-canvas` (#1A1C1E) |
| Use teal, navy, or any off-brand blue | Use exactly `#1B4F9E` |
| Use pure black (`#000000`) as background | Use Charcoal 900 `#1A1C1E` |
| Use Gold as a primary CTA | Gold is only for premium/achievement markers |
| Use Red for decorative purposes | Red means danger. Use it only for errors/alerts |
| Approximate the green to a bright lime | Use `#1D7A3A` — this is a deep, trustworthy green |
| Add new brand colours without approval | All palette changes require product owner sign-off |

---

## Colour + Meaning Reference Card

```
Blue   = Do this / Trust me / Primary action
Green  = Done / Success / Active / Growing
Red    = Stop / Error / Danger / Delete
Gold   = Premium / Achievement / Rating / Highlight
White  = Clarity / Emphasis on dark surface
Grey   = Secondary / Muted / Disabled / Supporting
```

---

*The four-colour system is deliberate. It mirrors the Nigerian flag (green) and the confidence of institutional blue, framed by the ambition of gold and the urgency of red. It's not arbitrary — it's a brand statement.*