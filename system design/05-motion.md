# 05 — Motion System
**Tutaly Design System** | Animation is communication, not decoration.

> Tutaly moves with purpose. Every transition tells the user something: what changed, where to look, what happened. Motion is never frivolous, never jarring, and never slow.

---

## Motion Principles

### 1. Motion Communicates, Not Decorates
Every animation must answer: *what information does this motion carry?* If it carries none, remove it.

### 2. Fast First
Default to fast. Users on professional platforms are task-oriented. Slow animations communicate leisure — Tutaly communicates efficiency.

### 3. Consistent Direction
UI entering the screen moves in from the direction of its trigger. Modals drop from top. Drawers slide from the side. Toasts rise from the bottom.

### 4. Respect Preferences
All animations must honour `prefers-reduced-motion`. Users with vestibular disorders or motion sensitivity get static alternatives automatically.

---

## Duration Tokens

```css
:root {
  --duration-instant:   50ms;    /* Micro feedback: checkbox tick, toggle switch */
  --duration-fast:     100ms;    /* Button press, icon swap */
  --duration-normal:   150ms;    /* Default: hover states, input focus */
  --duration-medium:   200ms;    /* Card hover, dropdown open */
  --duration-slow:     300ms;    /* Modal enter, page transitions */
  --duration-slower:   400ms;    /* Drawer slide, complex reveals */
  --duration-deliberate: 500ms;  /* Hero animations, onboarding reveals */
}
```

---

## Easing Tokens

```css
:root {
  /* Standard — default for most UI */
  --ease-standard:  cubic-bezier(0.4, 0, 0.2, 1);

  /* Enter — elements coming in (accelerate then slow) */
  --ease-enter:     cubic-bezier(0, 0, 0.2, 1);

  /* Exit — elements leaving (start slow, exit fast) */
  --ease-exit:      cubic-bezier(0.4, 0, 1, 1);

  /* Bounce — success states, achievement moments */
  --ease-bounce:    cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Linear — progress bars, loading states */
  --ease-linear:    linear;
}
```

---

## Named Transitions

### Hover (Default Card / Button)
```css
transition: background var(--duration-normal) var(--ease-standard),
            border-color var(--duration-normal) var(--ease-standard),
            box-shadow var(--duration-normal) var(--ease-standard),
            transform var(--duration-fast) var(--ease-standard);
```

### Focus Ring
```css
transition: box-shadow var(--duration-fast) var(--ease-standard),
            border-color var(--duration-fast) var(--ease-standard);
```

### Fade In (Toast, Tooltip, Badge)
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.animate-fade-in {
  animation: fadeIn var(--duration-normal) var(--ease-enter) forwards;
}
```

### Slide Up (Toasts, Bottom Sheets)
```css
@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-slide-up {
  animation: slideUp var(--duration-slow) var(--ease-enter) forwards;
}
```

### Slide Down (Modal, Dropdown)
```css
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-slide-down {
  animation: slideDown var(--duration-medium) var(--ease-enter) forwards;
}
```

### Scale In (Confirmation Pop, Success)
```css
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
}
.animate-scale-in {
  animation: scaleIn var(--duration-slow) var(--ease-bounce) forwards;
}
```

### Skeleton Pulse (Loading States)
```css
@keyframes skeletonPulse {
  0%   { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-charcoal-700) 25%,
    var(--color-charcoal-600) 50%,
    var(--color-charcoal-700) 75%
  );
  background-size: 400px 100%;
  animation: skeletonPulse 1.4s var(--ease-linear) infinite;
  border-radius: var(--radius-sm);
}
```

---

## Component Motion Map

| Component | Animation | Duration | Easing |
|-----------|-----------|----------|--------|
| Button press | `scale(0.98)` | `--duration-fast` | `--ease-standard` |
| Card hover | `border-color` + `box-shadow` | `--duration-normal` | `--ease-standard` |
| Dropdown open | `slideDown` | `--duration-medium` | `--ease-enter` |
| Modal enter | `slideDown` + `fadeIn` | `--duration-slow` | `--ease-enter` |
| Toast enter | `slideUp` | `--duration-slow` | `--ease-enter` |
| Toast exit | `fadeIn` reverse | `--duration-normal` | `--ease-exit` |
| Success confirmation | `scaleIn` | `--duration-slow` | `--ease-bounce` |
| Loading skeleton | `skeletonPulse` | 1.4s | `--ease-linear` |
| Nav scrolled (glass effect) | `backdrop-filter` | `--duration-normal` | `--ease-standard` |
| Input focus ring | `box-shadow` expand | `--duration-fast` | `--ease-standard` |
| Tab switch | Content `fadeIn` | `--duration-normal` | `--ease-enter` |
| Page transition | `fadeIn` | `--duration-slow` | `--ease-enter` |

---

## Reduced Motion Override

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

This block must be present in the global stylesheet. It is not optional.

---

## Motion Don'ts

| ❌ Never | ✓ Instead |
|---------|----------|
| Animate for more than 500ms (feels sluggish) | Max `--duration-deliberate` for hero only |
| Use `linear` easing for UI transitions | Use `--ease-standard` |
| Animate multiple elements simultaneously without stagger | Stagger max 50ms between items |
| Use bounce easing on error states | Bounce only on success/achievement |
| Animate layout properties (width, height, top, left) | Use `transform` and `opacity` only |
| Add loading spinners without a skeleton alternative | Always provide skeleton for content areas |
| Forget `prefers-reduced-motion` | This is non-negotiable |

---

*Motion is Tutaly's handshake with the user. Too slow and it feels clunky. Too flashy and it feels unserious. The sweet spot is confident and smooth — the way a premium product moves.*
