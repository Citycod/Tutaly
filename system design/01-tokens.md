# 01 — Design Tokens
**Tutaly Design System** | The atomic source of truth for all visual decisions.

> Every value in this file maps to a CSS custom property. No value in Tutaly's codebase is hardcoded. If you need a value, it lives here first.

---

## Colour Tokens

### Primitive (Raw Brand Values))

```css
:root {
  /* Brand Primitives — Never use these directly in components */
  --color-red-500:    #CC2B2B;
  --color-red-400:    #E03B3B;
  --color-red-600:    #A82020;

  --color-green-500:  #1D7A3A;
  --color-green-400:  #24994A;
  --color-green-600:  #155C2B;
  --color-green-300:  #2DB85A;

  --color-blue-500:   #1B4F9E;
  --color-blue-400:   #2262C2;
  --color-blue-600:   #143D7A;
  --color-blue-300:   #3A7DE0;

  --color-gold-500:   #C9A227;
  --color-gold-400:   #DDB630;
  --color-gold-600:   #A8851E;
  --color-gold-300:   #F0CC55;

  /* Neutrals */
  --color-charcoal-900: #1A1C1E;  /* Base canvas */
  --color-charcoal-800: #22252A;  /* Elevated surface */
  --color-charcoal-700: #2C3038;  /* Card surface */
  --color-charcoal-600: #383D47;  /* Subtle border */
  --color-charcoal-500: #4A5060;  /* Muted text bg */
  --color-charcoal-400: #6B7280;  /* Placeholder / ghost */
  --color-charcoal-300: #9CA3AF;  /* Secondary text */
  --color-charcoal-200: #D1D5DB;  /* Body text */
  --color-charcoal-100: #F3F4F6;  /* Headings on dark */
  --color-white:        #FFFFFF;
}
```

### Semantic Aliases (Use These in Components)

```css
:root {
  /* Backgrounds */
  --bg-canvas:        var(--color-charcoal-900);  /* Page background */
  --bg-surface:       var(--color-charcoal-800);  /* Cards, panels */
  --bg-elevated:      var(--color-charcoal-700);  /* Dropdowns, modals */
  --bg-overlay:       rgba(26, 28, 30, 0.85);     /* Modal backdrop */
  --bg-glass:         rgba(34, 37, 42, 0.72);     /* Glass effect panels */

  /* Text */
  --text-primary:     var(--color-charcoal-100);
  --text-secondary:   var(--color-charcoal-300);
  --text-muted:       var(--color-charcoal-400);
  --text-disabled:    var(--color-charcoal-500);
  --text-inverse:     var(--color-white);
  --text-on-brand:    var(--color-white);

  /* Brand Semantic */
  --color-primary:    var(--color-blue-500);      /* CTAs, links, focus rings */
  --color-primary-hover: var(--color-blue-400);
  --color-success:    var(--color-green-500);
  --color-success-light: var(--color-green-300);
  --color-danger:     var(--color-red-500);
  --color-danger-light: var(--color-red-400);
  --color-warning:    var(--color-gold-500);
  --color-warning-light: var(--color-gold-300);
  --color-premium:    var(--color-gold-500);      /* Premium features, badges */

  /* Borders */
  --border-subtle:    var(--color-charcoal-600);
  --border-default:   var(--color-charcoal-500);
  --border-strong:    var(--color-charcoal-400);
  --border-brand:     var(--color-blue-500);
  --border-focus:     var(--color-blue-400);

  /* Interactive */
  --interactive-default:  var(--color-blue-500);
  --interactive-hover:    var(--color-blue-400);
  --interactive-active:   var(--color-blue-600);
  --interactive-disabled: var(--color-charcoal-500);
}
```

---

## Spacing Tokens

Based on a **4px base unit**. Spacing never uses arbitrary values — only multiples of 4px.

```css
:root {
  --space-0:    0px;
  --space-1:    4px;    /* Micro — icon padding, tight gaps */
  --space-2:    8px;    /* XS — inline spacing */
  --space-3:    12px;   /* SM — compact component padding */
  --space-4:    16px;   /* MD — standard component padding (default) */
  --space-5:    20px;   /* LG — card internal spacing */
  --space-6:    24px;   /* XL — section gaps within a card */
  --space-8:    32px;   /* 2XL — between components */
  --space-10:   40px;   /* 3XL — section padding */
  --space-12:   48px;   /* 4XL — major section gaps */
  --space-16:   64px;   /* 5XL — page-level padding */
  --space-20:   80px;   /* 6XL — hero sections */
  --space-24:   96px;   /* 7XL — landing sections */
}
```

---

## Border Radius Tokens

```css
:root {
  --radius-none:   0px;
  --radius-sm:     4px;    /* Input fields, small chips */
  --radius-md:     8px;    /* Buttons, badges, small cards */
  --radius-lg:     12px;   /* Cards, panels */
  --radius-xl:     16px;   /* Large cards, modals */
  --radius-2xl:    24px;   /* Feature cards, hero elements */
  --radius-full:   9999px; /* Pills, avatars, toggle buttons */
}
```

---

## Shadow Tokens

```css
:root {
  /* Elevation system — darker, not lighter */
  --shadow-sm:   0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);
  --shadow-md:   0 4px 6px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3);
  --shadow-lg:   0 10px 15px rgba(0, 0, 0, 0.5), 0 4px 6px rgba(0, 0, 0, 0.3);
  --shadow-xl:   0 20px 25px rgba(0, 0, 0, 0.55), 0 10px 10px rgba(0, 0, 0, 0.3);

  /* Brand glow shadows — used sparingly on key actions */
  --shadow-blue-glow:  0 0 20px rgba(27, 79, 158, 0.35);
  --shadow-gold-glow:  0 0 20px rgba(201, 162, 39, 0.3);
  --shadow-green-glow: 0 0 16px rgba(29, 122, 58, 0.3);
}
```

---

## Border Tokens

```css
:root {
  --border-width-thin:   1px;
  --border-width-medium: 2px;
  --border-width-thick:  3px;

  --border-style-solid:  solid;
  --border-style-dashed: dashed;

  /* Shorthand */
  --border-subtle-line:  1px solid var(--border-subtle);
  --border-default-line: 1px solid var(--border-default);
  --border-brand-line:   2px solid var(--border-brand);
  --border-focus-ring:   2px solid var(--border-focus);
}
```

---

## Z-Index Tokens

```css
:root {
  --z-base:      0;
  --z-raised:    10;
  --z-dropdown:  100;
  --z-sticky:    200;
  --z-overlay:   300;
  --z-modal:     400;
  --z-toast:     500;
  --z-tooltip:   600;
}
```

---

## Opacity Tokens

```css
:root {
  --opacity-disabled: 0.4;
  --opacity-muted:    0.6;
  --opacity-ghost:    0.08;   /* Glass/frosted backgrounds */
  --opacity-overlay:  0.85;   /* Modal backdrops */
}
```

---

## Breakpoint Reference

Not CSS variables (media queries don't support custom properties), but documented here as the system's single reference.

```
--breakpoint-sm:   480px    /* Mobile landscape */
--breakpoint-md:   768px    /* Tablet portrait */
--breakpoint-lg:   1024px   /* Tablet landscape / small laptop */
--breakpoint-xl:   1280px   /* Desktop */
--breakpoint-2xl:  1536px   /* Large desktop */
```

---

## Glass Effect Token

Used for premium surfaces — dashboard widgets, featured cards, modal headers.

```css
.glass-surface {
  background: var(--bg-glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: var(--border-subtle-line);
}

.glass-surface-strong {
  background: rgba(34, 37, 42, 0.88);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```

---

*This file is the root of the system. If you want to change any visual value in Tutaly, you change it here — nowhere else.*
