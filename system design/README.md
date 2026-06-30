# Tutaly Design System — Master Index
**Version:** 1.0.0 | **Status:** Active | **Owner:** Edudje Wisdom

---

## What This Is

This is Tutaly's complete Design System DNA — the single source of truth for every visual, textual, and interaction decision made on the platform. It exists to ensure the platform feels like one coherent product, not a patchwork of individual decisions.

Tutaly is a trusted, professional ecosystem. Every pixel, every word, every animation should reinforce that. Not flashy. Not generic. **Trusted.**

---

## File Structure

```
tutaly-design-system/
├── README.md                    ← You are here (Master Index)
├── 01-tokens.md                 ← Design tokens (colours, spacing, radii, shadows, motion)
├── 02-typography.md             ← Type system, scale, usage rules
├── 03-colour.md                 ← Full colour system, semantic aliases, dark mode
├── 04-components.md             ← Component library rules and anatomy
├── 05-motion.md                 ← Animation principles and named durations
├── 06-icons.md                  ← Icon system, sizing, usage rules
├── 07-illustrations.md          ← Illustration language, style, empty states
├── 08-copy-voice.md             ← Brand voice, microcopy, tone of voice
├── 09-feedback-system.md        ← Toasts, errors, empty states, loading, success
├── 10-master-prompt.md          ← Antigravity developer instruction set (CRITICAL)
```

---

## Benchmarks

Tutaly's design system was structured by auditing:

| Benchmark | What We Took |
|-----------|-------------|
| **Indeed.com** | Information architecture, job card density, search UX patterns, nav structure |
| **Glassdoor.com** | Review card anatomy, salary display, trust signal placement, star systems |
| **Paystack** | African enterprise polish, CTA hierarchy, dark/light surface contrast |
| **Levels.fyi** | Data table design, salary intelligence UI, professional credibility markers |

---

## Brand DNA in One Sentence

> Tutaly is where Nigerian and African professionals go to grow — it feels like walking into a premium headquarters, not scrolling a feed.

---

## Core Brand Attributes

| Attribute | What It Means in UI |
|-----------|-------------------|
| **Trusted** | Consistent spacing, no surprise interactions, clear feedback |
| **Professional** | Dense but breathable information, no clutter, no gimmicks |
| **Empowering** | Users always know where they are and what to do next |
| **Local-first** | Naira (₦) as the primary currency symbol, Nigerian context in copy |
| **Premium** | Glass effects, smooth motion, high-contrast typography |

---

## Colour Brand Palette (Non-Negotiable)

```
Red    #CC2B2B   — Danger, alerts, urgency, passion
Green  #1D7A3A   — Success, growth, active states, Nigeria-resonant
Blue   #1B4F9E   — Trust, primary actions, links
Gold   #C9A227   — Premium, achievement, highlights, accent
Base   #1A1C1E   — Dark charcoal canvas
```

These five values are sacred. They are never approximated, swapped, or replaced.

---

## How to Use This System

1. **Antigravity reads `10-master-prompt.md` first** — every session, before touching code.
2. All visual decisions reference `01-tokens.md` — never hardcode values.
3. All copy decisions reference `08-copy-voice.md` — never write UI text from instinct.
4. All feedback states (errors, empty states, loading) reference `09-feedback-system.md`.
5. When in doubt: reference the benchmark sites listed above, then apply Tutaly's tokens on top.

---

## What Is Never Acceptable

- Hardcoded hex values in component code (use CSS variables from tokens)
- White backgrounds on dark surfaces (Tutaly is dark-first)
- Generic error messages ("Something went wrong")
- Placeholder copy left in production
- Components that don't have a documented hover, focus, and disabled state
- Breaking backend logic to achieve a visual outcome

---

*Last updated: June 2026 | Maintained by: Edudje Wisdom + Claude (Anthropic)*
