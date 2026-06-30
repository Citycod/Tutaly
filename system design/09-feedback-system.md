# 09 — Feedback System
**Tutaly Design System** | Every state the platform can be in — and how to communicate it.

> A platform communicates through its states as much as its screens. Loading, errors, empty, and success states are not afterthoughts — they are core UX. Handled well, they build trust. Handled poorly, they destroy it.

---

## Feedback Hierarchy

There are five categories of feedback in Tutaly:

1. **Loading States** — Something is happening; wait
2. **Success States** — Something worked; proceed
3. **Error States** — Something failed; here's why + what to do
4. **Warning States** — Something needs attention before proceeding
5. **Empty States** — Nothing here yet; here's what to do

---

## 1. Loading States

### Skeleton Screens (Preferred)
Used for: page load, content refresh, tab switch
Never use a spinner where content shape is predictable.

```
┌─────────────────────────────────────┐
│  ████████████████       ██████████  │
│  ████████              ████████     │
│  ████████████████████               │
│  ████                 ████████████  │
└─────────────────────────────────────┘
```

Skeleton implementation:
```css
.skeleton-line {
  height: 16px;
  border-radius: var(--radius-sm);
  animation: skeletonPulse 1.4s linear infinite;
  background: linear-gradient(
    90deg,
    var(--color-charcoal-700) 25%,
    var(--color-charcoal-600) 50%,
    var(--color-charcoal-700) 75%
  );
  background-size: 400px 100%;
}

.skeleton-avatar {
  width: 40px; height: 40px;
  border-radius: var(--radius-full);
}

.skeleton-card {
  height: 120px;
  border-radius: var(--radius-lg);
}
```

**Rule:** Show skeleton for minimum 200ms even if content loads faster (prevents jarring flash).

---

### Spinner (Fallback When Shape is Unknown)
Used for: button loading state, inline data fetch, unknown duration

```css
.spinner {
  width: 20px; height: 20px;
  border: 2px solid var(--border-subtle);
  border-top-color: var(--color-primary);
  border-radius: var(--radius-full);
  animation: spin 0.8s linear infinite;
}
```

**Rule:** Spinner replaces button label text on submit. Never show button text AND a spinner simultaneously.

```
Before:  [ Apply Now ]
During:  [ ◌ Applying... ]
After:   [ ✓ Applied ]
```

---

### Progress Bar
Used for: file upload, multi-step form, data processing

```css
.progress-bar-track {
  height: 4px;
  background: var(--bg-elevated);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: var(--radius-full);
  transition: width 300ms var(--ease-standard);
}

/* Success complete */
.progress-bar-fill.complete {
  background: var(--color-success);
}
```

---

## 2. Success States

### Toast Notification (Primary Success Channel)

Position: **Bottom-right** on desktop, **bottom-centre** on mobile.
Duration: Auto-dismiss after **4 seconds**. Persistent only for critical actions.

```
╔════════════════════════════════════╗
║  ✓  Application submitted.         ✕ ║
╚════════════════════════════════════╝
```

```css
.toast {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  background: var(--bg-elevated);
  border: var(--border-subtle-line);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  min-width: 280px;
  max-width: 420px;
  animation: slideUp var(--duration-slow) var(--ease-enter) forwards;
}

.toast-success { border-left: 3px solid var(--color-success); }
.toast-error   { border-left: 3px solid var(--color-danger); }
.toast-warning { border-left: 3px solid var(--color-warning); }
.toast-info    { border-left: 3px solid var(--color-primary); }
```

Toast icon sizes: `--icon-md` (20px)
Toast text: `type-body-sm` + `--text-primary`
Dismiss "×": always visible, `--text-muted`

**Copy rules for success toasts:**
- Past tense, noun-first: "Application submitted." "Profile updated." "Job saved."
- Maximum 8 words
- Never exclamation marks ("Great! Your application was sent!" ← never)

---

### Inline Success
For form field confirmation (e.g., email validation passed):

```
[ ✓ you@email.com                    ]
  ✓ Email address confirmed.
```

```css
.input-success {
  border-color: var(--color-success);
}
.input-success-text {
  color: var(--color-success);
  font-size: var(--text-xs);
  margin-top: var(--space-1);
}
```

---

### Page-Level Success (Full Action Complete)
Used for: completed application, submitted review, payment confirmed

```
╔══════════════════════════════════════════╗
║                                          ║
║         ✓  (large checkmark icon)        ║
║                                          ║
║    Application Submitted                 ║
║    We've sent your details to Andela.    ║
║    Check your applications dashboard.   ║
║                                          ║
║    [ View Application ]  [ Find More Jobs ] ║
╚══════════════════════════════════════════╝
```

---

## 3. Error States

### Error Principles
1. **Explain what happened** — don't just say "error"
2. **Tell them what to do** — always provide a path forward
3. **Never blame the user** — technical failures are our problem
4. **Be specific** — vague errors erode trust

### Form Field Errors

```
[ Enter your email address            ]
⚠ Enter a valid email address.
```

```css
.input-error {
  border-color: var(--color-danger);
  box-shadow: 0 0 0 3px rgba(204, 43, 43, 0.12);
}
.error-text {
  color: var(--color-danger);
  font-size: var(--text-xs);
  margin-top: var(--space-1);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}
```

### Toast Error
```
╔════════════════════════════════════╗
║  ✕  Couldn't submit application.   ✕ ║
║      Check your resume and retry.    ║
╚════════════════════════════════════╝
```

- Persists for 6 seconds (longer than success — user needs more time)
- Includes an action when possible: "Retry" / "Fix Now" / "Check Connection"

### Banner Error (Page-Level)
For server errors, session expired, or loss of connectivity:

```css
.error-banner {
  background: var(--color-danger-bg);   /* rgba(204,43,43,0.12) */
  border: 1px solid var(--color-danger);
  border-radius: var(--radius-md);
  padding: var(--space-4) var(--space-5);
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
}
```

```
╔══════════════════════════════════════════════╗
║  ⚠  Your session has expired.               ║
║     Sign back in to continue where you left off. ║
║                          [ Sign In Again ]   ║
╚══════════════════════════════════════════════╝
```

### Error Copy Library

| Trigger | Copy |
|---------|------|
| Server error (500) | "Something went wrong on our end. Refresh and try again." |
| Network error | "Can't reach Tutaly. Check your connection." |
| Session expired | "Your session has expired. Sign back in." |
| Not found (404) | "This page doesn't exist." |
| Access denied | "You don't have permission to view this." |
| File too large | "This file is too large. Maximum size is 5MB." |
| Upload failed | "Upload failed. Check your file and try again." |
| Payment failed | "Payment wasn't processed. Check your card details." |
| Form invalid | "Check the highlighted fields before submitting." |
| Search no results | "No results for '[query]'. Try different keywords." |

---

## 4. Warning States

Warnings are pre-emptive — shown before a potentially irreversible or important action.

### Inline Warning (Form Context)
```
╔══════════════════════════════════════╗
║  ⚠  Your job post expires in 2 days. ║
║     Renew now to keep it visible.    ║
║                      [ Renew Post ]  ║
╚══════════════════════════════════════╝
```

```css
.warning-banner {
  background: rgba(201, 162, 39, 0.1);
  border: 1px solid var(--color-warning);
  border-radius: var(--radius-md);
  padding: var(--space-4) var(--space-5);
}
```

### Confirmation Dialog (Destructive Actions)
Required for: delete account, delete job post, close campaign, remove review

```
╔══════════════════════════════════╗
║  Delete this job post?           ║
║                                  ║
║  This action can't be undone.    ║
║  Candidates won't be able to     ║
║  find or apply to this listing.  ║
║                                  ║
║  [ Cancel ]  [ Delete Post ]     ║
╚══════════════════════════════════╝
```

Rules:
- Cancel is always `btn-secondary` (left)
- Destructive action is always `btn-danger` (right)
- Never reverse this order
- Modal: `--bg-elevated`, `--shadow-xl`, `--radius-xl`
- Copy: No "Are you sure?" — State what will happen, not ask permission

---

## 5. Empty States

Full documentation of empty state copy and illustrations in `07-illustrations.md`.

**Structural rules for all empty states:**

```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--space-16) var(--space-8);
  gap: var(--space-4);
}

.empty-state-illustration {
  width: 200px;
  height: 160px;
  opacity: 0.85;
}

.empty-state-title {
  /* type-heading-md */
  color: var(--text-primary);
  margin: 0;
}

.empty-state-description {
  /* type-body-sm */
  color: var(--text-muted);
  max-width: 320px;
  margin: 0;
}
```

**Always provide a path forward.** Empty states are not dead ends — they are invitations.

---

## Feedback System: Decision Tree

```
User takes action
       │
       ├── Action has a loading phase?
       │         ├── Content shape known → Skeleton screen
       │         └── Content shape unknown → Spinner in button
       │
       └── Action completes
                 ├── Success → Toast (bottom-right, 4s)
                 │            └── Major action → Page-level success state
                 ├── Error → Toast with action (6s) + explain what to do
                 └── Partial (warning) → Inline banner with CTA
```

---

*The feedback system is where users discover if Tutaly respects them. A platform that explains its failures is a platform that can be trusted.*
