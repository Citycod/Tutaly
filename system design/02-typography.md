# 02 — Typography System
**Tutaly Design System** | The voice of the platform in visual form.

> Typography is not decoration — it is the primary carrier of trust on a professional platform. Every weight, size, and spacing decision is intentional.

---

## Font Stack

### Primary Display — Inter
Used for: headings, display text, marketing copy, navigation.
Why: Inter is the enterprise standard — neutral, professional, globally readable, renders beautifully at all sizes. Used by Notion, Linear, Vercel, Paystack.

```css
--font-display: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Body / Prose — Inter
Used for: body copy, descriptions, form labels, card content.
Same family as display but with different weight/size treatment creates natural hierarchy without visual chaos.

```css
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Data / Monospace — JetBrains Mono
Used for: salary figures, statistics, code, numeric data, table values.
Why: Monospace for numbers creates instant legibility — critical for the Salary Intelligence module.

```css
--font-mono: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', 'Fira Code', monospace;
```

### Import (Google Fonts)
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

---

## Type Scale

Based on a **1.25 modular scale** (Major Third). Every step is deliberate.

```css
:root {
  /* Scale */
  --text-xs:    0.75rem;    /* 12px — Labels, captions, metadata */
  --text-sm:    0.875rem;   /* 14px — Secondary body, form help text */
  --text-base:  1rem;       /* 16px — Primary body text */
  --text-lg:    1.125rem;   /* 18px — Lead paragraphs, card titles */
  --text-xl:    1.25rem;    /* 20px — Section subtitles */
  --text-2xl:   1.5rem;     /* 24px — Card headings, modal titles */
  --text-3xl:   1.875rem;   /* 30px — Section headings */
  --text-4xl:   2.25rem;    /* 36px — Page titles */
  --text-5xl:   3rem;       /* 48px — Hero headings */
  --text-6xl:   3.75rem;    /* 60px — Landing hero display */

  /* Weights */
  --font-light:    300;
  --font-regular:  400;
  --font-medium:   500;
  --font-semibold: 600;
  --font-bold:     700;
  --font-extrabold:800;

  /* Line Heights */
  --leading-tight:  1.2;
  --leading-snug:   1.35;
  --leading-normal: 1.5;
  --leading-relaxed:1.65;
  --leading-loose:  1.8;

  /* Letter Spacing */
  --tracking-tight:   -0.025em;
  --tracking-normal:   0;
  --tracking-wide:     0.025em;
  --tracking-wider:    0.05em;
  --tracking-widest:   0.1em;
}
```

---

## Semantic Type Roles

These are the named type roles you apply to components. Never set raw font-size values in components — use these roles.

```css
/* Display — Hero sections, marketing headers */
.type-display-xl {
  font-family: var(--font-display);
  font-size: var(--text-6xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  color: var(--text-primary);
}

.type-display-lg {
  font-family: var(--font-display);
  font-size: var(--text-5xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  color: var(--text-primary);
}

/* Heading — Page and section titles */
.type-heading-xl {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
  letter-spacing: var(--tracking-tight);
}

.type-heading-lg {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
}

.type-heading-md {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
}

.type-heading-sm {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-normal);
}

/* Body — Content, descriptions */
.type-body-lg {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: var(--font-regular);
  line-height: var(--leading-relaxed);
  color: var(--text-secondary);
}

.type-body-md {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: var(--font-regular);
  line-height: var(--leading-relaxed);
  color: var(--text-secondary);
}

.type-body-sm {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  line-height: var(--leading-normal);
  color: var(--text-muted);
}

/* Label — UI labels, tags, form labels */
.type-label-lg {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  line-height: var(--leading-normal);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
}

.type-label-md {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
}

/* Data — Salary figures, stats, numbers */
.type-data-lg {
  font-family: var(--font-mono);
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  letter-spacing: var(--tracking-tight);
  color: var(--text-primary);
}

.type-data-md {
  font-family: var(--font-mono);
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
}

.type-data-sm {
  font-family: var(--font-mono);
  font-size: var(--text-base);
  font-weight: var(--font-regular);
}

/* Caption — Metadata, timestamps, footnotes */
.type-caption {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-regular);
  line-height: var(--leading-normal);
  color: var(--text-muted);
}
```

---

## Module-Specific Typography Guidelines

### Job Board Module
- Job title: `type-heading-sm` + `--text-primary`
- Company name: `type-body-md` + `--text-secondary`
- Location / type: `type-caption`
- Salary range: `type-data-md` + `--color-success`

### Salary Intelligence Module
- Salary figure (₦ amount): `type-data-lg` + `--text-primary`
- Range (min–max): `type-data-sm` + `--text-secondary`
- Percentile label: `type-label-md`
- Source count: `type-caption`

### Company Reviews Module
- Rating number: `type-data-lg` + `--color-gold-500`
- Review title: `type-heading-sm`
- Review body: `type-body-md`
- Reviewer role / date: `type-caption`

### Marketplace Module
- Product title: `type-heading-sm`
- Price: `type-data-md` + `--color-primary`
- Seller name: `type-body-sm`

### Connect (Social Feed) Module
- Post text: `type-body-md`
- Username: `type-body-sm` + `--font-semibold`
- Timestamp: `type-caption`
- Engagement count: `type-label-md`

---

## Typography Don'ts

| ❌ Never | ✓ Instead |
|---------|----------|
| Mix more than 2 font families | Use Inter for everything, JetBrains Mono for data |
| Use font-size below 12px | Minimum `--text-xs` (12px) |
| Use light weight (300) for body text | Use regular (400) minimum for body |
| Uppercase for body copy | Uppercase only for `type-label` roles |
| Hardcode px values in components | Use the CSS variables from this file |
| Use white text on gold or red backgrounds | Use `--color-charcoal-900` or `--color-white` appropriately |
| Set line-height to 1 for body text | Minimum `--leading-normal` (1.5) for readability |

---

*Typography is the first thing users trust. Get this right and the platform feels serious. Get it wrong and it feels amateur, regardless of the colour palette.*
