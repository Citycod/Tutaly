# 07 — Illustration Language
**Tutaly Design System** | Visual storytelling that earns trust.

> Illustrations on Tutaly do one job: make the platform feel human without making it feel amateur. They appear at strategic moments — empty states, onboarding, error pages — and always reinforce confidence, not apology.

---

## Illustration Philosophy

Tutaly's illustrations are **professional-optimistic**. They show:
- Professionals in motion (not static, not passive)
- Achievement, connection, and growth
- Nigerian and African visual identity (faces, context, attire where relevant)
- Confidence without arrogance

They never show:
- Generic clipart people
- Western-default characters (blonde, suburban, etc.)
- Sad, confused, or helpless states
- Complex scenes that distract from the UI

---

## Illustration Style

### Visual Style: Modern Flat + Depth Accents
- Flat illustration base with subtle gradient accents and soft drop shadows
- No outlines on character fills (character-skin merges with background)
- Simple geometric shapes, rounded corners
- Limited colour palette rooted in brand tokens

### Colour Palette for Illustrations

Illustrations draw from a restricted subset of brand tokens:

```
Primary:  Blue #1B4F9E → #3A7DE0 gradient
Accent:   Gold #C9A227 → #DDB630 for highlights
Success:  Green #1D7A3A for positive context
Neutral:  Charcoal 700 (#2C3038) for backgrounds
Skin:     Warm brown range — #8B5E3C, #A0714F, #C69B7B, #D4A76A
Text:     Charcoal 200 (#D1D5DB) for any text in illustration
```

### Character Design
- Faces: simple, expressive, non-caricature
- Attire: professional but not formal — business casual, modern African professional
- Diversity: represent Nigerian reality — no default-Western character bias
- No brand logos, company names, or copyrighted elements

### Stroke and Shape Language
- All strokes: 2px, matching icon system
- Rounded edges everywhere (consistent with `--radius-md` and above)
- Negative space is generous — illustrations breathe

---

## Illustration Inventory

### Empty States (Required for All Modules)

Each empty state has:
1. **Illustration** — 200×160px, centered
2. **Headline** — `type-heading-md`, 1 line max
3. **Subtext** — `type-body-sm`, `--text-muted`, 2 lines max
4. **CTA** — `btn-primary` if there's an action, `btn-secondary` if optional

#### Job Board — No Results
- **Illustration:** A professional looking at a compass or map
- **Headline:** "No jobs match your search"
- **Subtext:** "Try adjusting your filters or searching a broader location."
- **CTA:** "Clear Filters"

#### Job Board — No Saved Jobs
- **Illustration:** An empty bookmarked folder with a briefcase icon
- **Headline:** "You haven't saved any jobs yet"
- **Subtext:** "Bookmark jobs you like — they'll appear here."
- **CTA:** "Browse Jobs"

#### Company Reviews — No Reviews
- **Illustration:** A professional holding a speech bubble (empty)
- **Headline:** "No reviews yet for this company"
- **Subtext:** "Be the first to share your experience."
- **CTA:** "Write a Review"

#### Salary Intelligence — No Data
- **Illustration:** A bar chart with a question mark motif
- **Headline:** "No salary data for this role yet"
- **Subtext:** "Help the community — share your salary anonymously."
- **CTA:** "Add Salary"

#### Marketplace — No Listings
- **Illustration:** An open empty shopping bag
- **Headline:** "Nothing here yet"
- **Subtext:** "Check back soon — new resources are added regularly."
- **CTA:** "Browse All Products"

#### Connect — No Feed Content
- **Illustration:** A professional at a desk, laptop open, looking ready
- **Headline:** "Your feed is empty"
- **Subtext:** "Follow professionals and companies to build your feed."
- **CTA:** "Find People to Follow"

#### Notifications — Empty
- **Illustration:** A calm bell with a small green check mark
- **Headline:** "You're all caught up"
- **Subtext:** "We'll let you know when something needs your attention."
- **CTA:** None

---

### Error States

#### 404 — Page Not Found
- **Illustration:** A professional at a fork in the road, map in hand
- **Headline:** "This page doesn't exist"
- **Subtext:** "The link may be broken or the page may have moved."
- **CTA:** "Back to Home"

#### 500 — Server Error
- **Illustration:** A professional looking at a disconnected plug
- **Headline:** "Something went wrong on our end"
- **Subtext:** "We're working on it. Please try again in a moment."
- **CTA:** "Try Again"

#### Connection Lost
- **Illustration:** A disconnected wifi/network icon, minimal
- **Headline:** "You're offline"
- **Subtext:** "Check your connection and try again."
- **CTA:** "Retry"

---

### Onboarding Illustrations

Full-width panels (560×320px) for the onboarding flow. 3 screens:

1. **Find Your Next Role**
   - Scene: Professional walking confidently through a stylized doorway labelled with a briefcase
   - Mood: Purposeful, forward motion

2. **Know Your Worth**
   - Scene: Professional viewing a salary bar chart on a tablet, looking satisfied
   - Mood: Informed, empowered

3. **Connect & Grow**
   - Scene: Two professionals shaking hands with a globe-like network behind them
   - Mood: Collaborative, global yet local

---

### Achievement / Success Illustrations

Small celebratory illustrations (120×80px) for:

- **Application Submitted:** Confetti burst + checkmark
- **Profile Complete:** Professional with a gold star
- **First Connection Made:** Two hands connecting
- **Job Alert Set:** Bell with a glowing pulse

---

## Illustration Technical Specs

| Use Case | Size | Format | Placement |
|----------|------|--------|-----------|
| Empty states | 200×160px | SVG | Centered, above text |
| Error pages | 280×200px | SVG | Centered, above text |
| Onboarding panels | 560×320px | SVG | Left half of split panel |
| Achievements | 120×80px | SVG | Inline with success state |
| Marketing sections | Flexible | SVG | Right/left of copy block |

**Always SVG** — never PNG for illustrations. SVGs are:
- Infinitely scalable (retina-ready)
- Styleable with CSS (respects dark theme)
- Lightweight and fast loading

---

## What We Never Use

| ❌ Never | ✓ Instead |
|---------|----------|
| Stock photography of people | Custom illustrations |
| Generic cartoon characters | Tutaly-branded illustration set |
| Western-default representation | Nigerian/African professional aesthetic |
| Sad, broken, apologetic imagery | Empowering, forward-looking imagery |
| Complex, detailed scenes in empty states | Simple, clean, single-focus illustrations |
| Raster images (PNG/JPG) for illustrations | SVG always |
| Off-brand colours in illustrations | Only brand palette tokens |

---

*Illustrations are where Tutaly's personality lives. Get the illustration language wrong and the platform looks like every other job board. Get it right and it looks like it was built for the people it serves.*
