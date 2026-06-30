# 06 — Icon System
**Tutaly Design System** | Icons are vocabulary, not decoration.

> A good icon communicates instantly. A bad one makes users think. Tutaly's icon system is consistent, purposeful, and never ambiguous.

---

## Icon Library: Lucide Icons

**Primary icon set:** [Lucide Icons](https://lucide.dev)

**Why Lucide:**
- Open source, MIT license — no attribution required
- Consistent 24px grid with 2px stroke weight
- Modern, clean, professional — benchmarked against what Indeed and Glassdoor use
- React component library available (`lucide-react`)
- 1,400+ icons covering all Tutaly use cases

**Secondary / Custom:** Custom SVG icons for Tutaly-specific concepts (e.g., salary bar charts, career paths) built on the same 24px grid and 2px stroke.

---

## Icon Grid & Sizing

All Lucide icons are drawn on a **24×24px grid with 2px stroke weight**. This must be preserved at all sizes via `stroke-width` scaling.

```css
:root {
  --icon-xs:   12px;   /* Inline text indicators */
  --icon-sm:   16px;   /* Badges, tags, compact UI */
  --icon-md:   20px;   /* Default inline icons */
  --icon-lg:   24px;   /* Nav icons, button icons (default) */
  --icon-xl:   32px;   /* Feature icons */
  --icon-2xl:  40px;   /* Empty state icons */
  --icon-3xl:  64px;   /* Illustration icons, hero markers */
}
```

### Stroke Weight Rule
When scaling icons, adjust stroke-width proportionally to maintain visual weight:

| Size | Stroke Width |
|------|-------------|
| 12px | 1.5 |
| 16px | 1.75 |
| 20px | 2.0 (default) |
| 24px | 2.0 |
| 32px | 1.75 |
| 40px | 1.5 |
| 64px | 1.25 |

---

## Colour Usage Rules

Icons inherit colour through `currentColor` — never set fill or stroke directly.

```css
/* Correct */
.icon { color: var(--text-secondary); }

/* Never */
.icon { fill: #9CA3AF; }
.icon { stroke: #9CA3AF; }
```

### Icon Colour by Context

| Context | Token | Usage |
|---------|-------|-------|
| Default/inactive | `--text-muted` | Nav items, passive icons |
| Active/selected | `--color-primary` | Selected nav, active filter |
| Success action | `--color-success` | Confirmed, verified |
| Danger action | `--color-danger` | Delete, remove, error |
| Warning | `--color-warning` | Alert, required field |
| Premium/Gold | `--color-premium` | Premium badge, achievement |
| On primary button | `--text-inverse` | White icon on blue |

---

## Module Icon Map

### Core Navigation

| Icon Name | Lucide | Module |
|-----------|--------|--------|
| `Briefcase` | 💼 | Jobs / Job Board |
| `Building2` | 🏢 | Companies / Reviews |
| `BarChart2` | 📊 | Salary Intelligence |
| `ShoppingBag` | 🛍️ | Marketplace |
| `Users` | 👥 | Connect / Network |
| `Megaphone` | 📣 | Advertising / Campaigns |
| `LayoutDashboard` | 🗂️ | Employer Dashboard |

### Actions

| Icon Name | Lucide | Action |
|-----------|--------|--------|
| `Search` | 🔍 | Search everywhere |
| `Plus` / `PlusCircle` | ➕ | Create new |
| `Edit2` | ✏️ | Edit content |
| `Trash2` | 🗑️ | Delete (danger zone) |
| `Upload` | ⬆️ | Upload file/resume |
| `Download` | ⬇️ | Download |
| `ExternalLink` | ↗️ | Open in new tab |
| `Copy` | 📋 | Copy to clipboard |
| `Share2` | 🔗 | Share |
| `Filter` | ⚙️ | Filter/sort |
| `X` | ✕ | Close / dismiss |
| `Check` | ✓ | Confirm / done |
| `ChevronDown` | ∨ | Expand / select |
| `ArrowRight` | → | Navigate / continue |

### Status & Feedback

| Icon Name | Lucide | Meaning |
|-----------|--------|---------|
| `CheckCircle2` | ✅ | Success |
| `AlertCircle` | ⚠️ | Warning |
| `XCircle` | ❌ | Error |
| `Info` | ℹ️ | Information |
| `Clock` | 🕐 | Pending / time |
| `Lock` | 🔒 | Restricted / premium |
| `Shield` | 🛡️ | Verified / trusted |
| `Star` | ⭐ | Rating / favourite |
| `Bookmark` | 🔖 | Save / bookmark job |
| `Bell` | 🔔 | Notifications |
| `Eye` | 👁️ | View count / visible |

### People & Professional

| Icon Name | Lucide | Context |
|-----------|--------|---------|
| `User` | 👤 | Single profile |
| `Users` | 👥 | Team / network |
| `UserPlus` | 👤+ | Follow / connect |
| `MapPin` | 📍 | Location |
| `GraduationCap` | 🎓 | Education |
| `Award` | 🏆 | Achievement |
| `TrendingUp` | 📈 | Growth / career |
| `DollarSign` → `₦ custom` | ₦ | Naira / Salary |

### Salary Intelligence Specific

For the salary module, use a custom SVG salary icon on the 24px grid since no standard icon captures it well. Guidelines:
- Bar chart motif with an upward-pointing element
- Stroke: 2px, rounded ends (`stroke-linecap: round`)
- No fill — stroke-only consistent with Lucide system

---

## Icon + Text Pairing Rules

```css
/* Icon paired with text — always flex with gap */
.icon-label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);   /* 8px gap minimum */
}

/* Icon always same size as adjacent text line-height */
```

**Alignment rule:** Icon vertical center = text cap-height center. Use `align-items: center` and adjust with `margin-top: -1px` if optical alignment looks off at small sizes.

---

## Icon States

| State | CSS |
|-------|-----|
| Default | `color: var(--text-muted)` |
| Hover | `color: var(--text-secondary)`, `transition: 150ms` |
| Active | `color: var(--color-primary)` |
| Disabled | `color: var(--text-disabled); opacity: 0.4` |
| Loading | Replace icon with `<Loader2>` + CSS spin animation |

```css
@keyframes spin {
  to { transform: rotate(360deg); }
}
.icon-spin {
  animation: spin 1s linear infinite;
}
```

---

## What We Never Do

| ❌ Never | ✓ Instead |
|---------|----------|
| Use emoji in UI | Use Lucide icons |
| Mix icon libraries (FontAwesome + Lucide) | Lucide only |
| Use filled icons and outline icons together | Stroke-only (Lucide defaults) |
| Set icon sizes outside the defined scale | Use `--icon-*` tokens |
| Use icons without accessible labels | Add `aria-label` or visually hidden text |
| Use a generic icon when a specific one exists | Always use the most semantically accurate icon |

---

## Accessibility

Every icon used as a standalone interactive element needs:

```jsx
// Icon-only button
<button aria-label="Save job">
  <Bookmark size={20} />
</button>

// Decorative icon (next to text label) — hide from screen readers
<Briefcase size={20} aria-hidden="true" />
<span>Jobs</span>
```

---

*Icons are the shorthand of the interface. Used well, they make a platform feel fluent. Used poorly, they create confusion. Tutaly speaks fluently.*
