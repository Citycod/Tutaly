# 04 — Components
**Tutaly Design System** | Every component has rules. Every rule has a reason.

> Components are not styled HTML elements. They are trust-building units. Each one must communicate clearly, behave predictably, and feel like it belongs to Tutaly — not to a template.

---

## Component Architecture Principle

Every Tutaly component must define all five states:
1. **Default** — resting state
2. **Hover** — cursor over element
3. **Focus** — keyboard navigation / active input
4. **Active / Pressed** — click moment
5. **Disabled** — not available

No component ships without all five states documented and implemented.

---

## Buttons

### Button Hierarchy

Tutaly uses a strict three-tier button hierarchy. One page should never have two Primary buttons fighting for attention.

#### Primary Button — One CTA per view
```css
.btn-primary {
  background: var(--color-primary);         /* Blue #1B4F9E */
  color: var(--text-inverse);               /* White */
  padding: var(--space-3) var(--space-6);   /* 12px 24px */
  border-radius: var(--radius-md);          /* 8px */
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  letter-spacing: var(--tracking-wide);
  border: none;
  transition: background 150ms ease, transform 100ms ease, box-shadow 150ms ease;
}

.btn-primary:hover {
  background: var(--color-primary-hover);   /* Blue #2262C2 */
  box-shadow: var(--shadow-blue-glow);
}

.btn-primary:active {
  background: var(--interactive-active);
  transform: scale(0.98);
}

.btn-primary:focus-visible {
  outline: var(--border-focus-ring);
  outline-offset: 2px;
}

.btn-primary:disabled {
  background: var(--interactive-disabled);
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
}
```

**Copy rules:** Verb-first. "Apply Now" not "Now Apply". "Post Job" not "Job Posting". "Get Started" not "Let's Get Started".

#### Secondary Button — Supporting action
```css
.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: var(--border-default-line);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-weight: var(--font-semibold);
  font-size: var(--text-sm);
  transition: background 150ms ease, border-color 150ms ease;
}

.btn-secondary:hover {
  background: var(--opacity-ghost);  /* Subtle fill */
  border-color: var(--border-strong);
}
```

#### Ghost Button — Tertiary, low emphasis
```css
.btn-ghost {
  background: transparent;
  color: var(--color-primary);
  border: none;
  padding: var(--space-2) var(--space-4);
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
}

.btn-ghost:hover {
  text-decoration: underline;
}
```

#### Danger Button — Destructive actions only
```css
.btn-danger {
  background: var(--color-danger);
  color: var(--text-inverse);
  /* All other properties same as .btn-primary */
}
```

### Button Sizes
```css
.btn-sm  { padding: var(--space-2) var(--space-4);  font-size: var(--text-xs); }
.btn-md  { padding: var(--space-3) var(--space-6);  font-size: var(--text-sm); }  /* Default */
.btn-lg  { padding: var(--space-4) var(--space-8);  font-size: var(--text-base); }
.btn-xl  { padding: var(--space-5) var(--space-10); font-size: var(--text-lg); }
```

---

## Cards

### Base Card
```css
.card {
  background: var(--bg-surface);
  border: var(--border-subtle-line);
  border-radius: var(--radius-lg);       /* 12px */
  padding: var(--space-6);               /* 24px */
  transition: border-color 200ms ease, box-shadow 200ms ease;
}

.card:hover {
  border-color: var(--border-brand);
  box-shadow: var(--shadow-md);
}
```

### Job Card (Indeed-Inspired, Tutaly-Branded)

Anatomy (top to bottom):
1. Company logo (40×40px, `--radius-md`)
2. Job title — `type-heading-sm`
3. Company name — `type-body-sm` + `--color-primary` (clickable)
4. Location + job type — `type-caption` + icon
5. Salary range (if available) — `type-data-sm` + `--color-success`
6. Posted date — `type-caption` + `--text-muted`
7. Tags row (remote, full-time, etc.) — Pill badges
8. "Apply Now" button — `btn-primary btn-sm`

```
┌─────────────────────────────────────────┐
│  [Logo]  Product Manager                │
│          Flutterwave  •  Lagos, Nigeria  │
│          ₦600,000 – ₦900,000 / month    │
│  [Remote] [Full-time] [Fintech]         │
│                              Apply Now → │
└─────────────────────────────────────────┘
```

### Company Review Card (Glassdoor-Inspired)

Anatomy:
1. Star rating — Gold stars + numeric score (`type-data-md` + `--color-gold-500`)
2. Review title — `type-heading-sm`
3. Role + date — `type-caption`
4. "Pros" section — `type-body-sm`, green left-border accent
5. "Cons" section — `type-body-sm`, red left-border accent
6. "Would recommend" pill — green or red chip

### Salary Card

Anatomy:
1. Role title — `type-heading-sm`
2. Average salary (₦) — `type-data-lg` + `--color-success`
3. Range bar (min → median → max) — Green gradient bar
4. Sample count — `type-caption` + `--text-muted`
5. Location filter pill

### Marketplace Product Card

Anatomy:
1. Product thumbnail (aspect ratio 16:9)
2. Product title — `type-heading-sm`
3. Seller name — `type-body-sm` + avatar
4. Price — `type-data-md` + `--color-primary`
5. Rating — Star row + count (`type-caption`)
6. "View Details" — `btn-secondary btn-sm`

---

## Form Elements

### Text Input
```css
.input {
  background: var(--bg-elevated);
  border: var(--border-default-line);
  border-radius: var(--radius-sm);       /* 4px */
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-base);
  color: var(--text-primary);
  width: 100%;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}

.input::placeholder {
  color: var(--text-muted);
}

.input:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px rgba(27, 79, 158, 0.2);
}

.input.error {
  border-color: var(--color-danger);
  box-shadow: 0 0 0 3px rgba(204, 43, 43, 0.15);
}

.input:disabled {
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
}
```

### Form Label
```css
.label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
  margin-bottom: var(--space-2);
  display: block;
}

.label.required::after {
  content: " *";
  color: var(--color-danger);
}
```

### Error Text (Below Input)
```css
.input-error-text {
  font-size: var(--text-xs);
  color: var(--color-danger);
  margin-top: var(--space-1);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}
```

---

## Badges & Pills

```css
/* Base pill */
.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
}

/* Variants */
.badge-primary { background: rgba(27,79,158,0.15);  color: var(--color-blue-300); }
.badge-success { background: rgba(29,122,58,0.15);  color: var(--color-green-300); }
.badge-danger  { background: rgba(204,43,43,0.15);  color: var(--color-red-300); }
.badge-warning { background: rgba(201,162,39,0.15); color: var(--color-gold-300); }
.badge-muted   { background: var(--charcoal-700);   color: var(--text-muted); }

/* Premium badge — Gold outline */
.badge-premium {
  background: transparent;
  border: 1px solid var(--color-gold-500);
  color: var(--color-gold-400);
}
```

---

## Navigation

### Top Nav

Structure (left → right):
1. **Logo** — Tutaly wordmark (SVG, 32px height)
2. **Primary nav links** — Jobs | Reviews | Salaries | Marketplace | Connect
3. **Right actions** — Search icon | Notifications bell | Post Job (CTA) | Profile avatar

Behaviour:
- Sticky at top, `z-index: var(--z-sticky)`
- Background: `var(--bg-canvas)` with bottom border `var(--border-subtle-line)`
- On scroll: `background: var(--bg-glass)` with `backdrop-filter: blur(12px)` — premium effect
- Active nav link: `--color-primary` underline, `--font-semibold`
- Hover: `--text-primary` from `--text-secondary`

### Search Bar (Anchored in Nav or Hero)

Two-field pattern (benchmarked from Indeed):
```
[ 🔍 Job title, skills, company... ] [ 📍 Lagos, Nigeria ▾ ] [ Search → ]
```

- Combined border, single visual unit
- Left field: keyword search
- Right field: location with Nigerian defaults (Lagos, Abuja, Port Harcourt, Remote)
- Search button: `btn-primary btn-lg`

---

## Avatars

```css
.avatar {
  border-radius: var(--radius-full);
  object-fit: cover;
  background: var(--bg-elevated);
  border: 2px solid var(--border-subtle);
}

/* Sizes */
.avatar-xs { width: 24px;  height: 24px; }
.avatar-sm { width: 32px;  height: 32px; }
.avatar-md { width: 40px;  height: 40px; }  /* Default */
.avatar-lg { width: 56px;  height: 56px; }
.avatar-xl { width: 80px;  height: 80px; }
```

---

## Star Rating Component

Used in Reviews and Marketplace. Gold on charcoal.

```
★★★★☆  4.2  (1,847 reviews)
```

- Filled star: `--color-gold-500`
- Empty star: `--color-charcoal-600`
- Score: `type-data-md` + `--color-gold-500`
- Review count: `type-caption` + `--text-muted`

---

## Component Don'ts

| ❌ Never | ✓ Instead |
|---------|----------|
| Two Primary buttons on same view | One Primary, one Secondary |
| Inline styles in components | Use CSS variables from tokens |
| Buttons without visible focus state | Implement `focus-visible` outline |
| Forms without error states | Every input needs `.error` variant |
| Cards without hover state | All interactive cards need hover feedback |
| Placeholder text as a label substitute | Always show visible label above input |
| Hardcoded pixel padding in cards | Use spacing tokens (`--space-*`) |

---

*Every component is a small promise to the user. Consistent components = a platform that feels trustworthy.*
