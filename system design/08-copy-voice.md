# 08 — Brand Voice & Copy System
**Tutaly Design System** | Words are design. Every word is a decision.

> The most trusted professional platforms in the world sound confident without being arrogant, warm without being casual, and clear without being cold. That's Tutaly's voice.

---

## Brand Voice

### Core Personality
Tutaly speaks like the most trusted mentor in the room — the person who gives you real advice, speaks plainly, and never condescends.

**Four words that describe Tutaly's voice:**

| Word | What It Means in Copy |
|------|-----------------------|
| **Direct** | Say exactly what it does. No fluff. No "discover" or "unlock". |
| **Confident** | Never hedge with "might", "perhaps", "we think". State facts. |
| **Warm** | Use second person ("you", "your") — always. Never cold or transactional. |
| **Local** | Naira-first. Nigerian context. Never assume US defaults. |

---

## Tone by Context

Tutaly's voice stays consistent but the **tone shifts** by situation:

| Situation | Tone | Example |
|-----------|------|---------|
| Onboarding | Welcoming + encouraging | "Your career starts here. Let's set up your profile." |
| Job search | Practical + motivating | "139 jobs match your profile in Lagos." |
| Salary data | Authoritative + empowering | "Product Managers in Lagos earn ₦550,000–₦1.2M/month." |
| Error states | Honest + calm | "Something went wrong on our end. Try again." |
| Empty states | Helpful + inviting | "No results yet. Try a broader search or different keywords." |
| Success states | Celebratory + brief | "Application sent." / "Profile updated." |
| Warnings | Clear + non-alarmist | "This action can't be undone." |
| Premium upsell | Aspirational + specific | "Unlock salary benchmarks for 50+ roles." |
| Notifications | Concise + actionable | "New job match: Senior Engineer at Andela." |

---

## Copywriting Rules

### 1. Lead with the verb
UI copy is action. Start with what the user will do or what happened.

```
❌ "Job applications are tracked here"
✓  "Track your applications"

❌ "Here you can view your saved jobs"
✓  "View saved jobs"

❌ "Salary information is available for this role"
✓  "See salary range for this role"
```

### 2. Be specific. Never be vague.
Vague copy breaks trust. Specific copy builds it.

```
❌ "An error occurred. Please try again."
✓  "We couldn't load your jobs right now. Check your connection and try again."

❌ "Something went wrong."
✓  "Your application wasn't submitted. Please check your resume and try again."

❌ "Upgrade your plan"
✓  "Unlock salary benchmarks — upgrade to Tutaly Pro"
```

### 3. Naira-first currency
Always show Nigerian Naira (₦) as the primary currency. Never show USD first on Nigerian-facing pages.

```
✓  ₦450,000/month
✓  ₦450,000 – ₦750,000 per month
✓  ₦5,400,000 per year

❌ $3,000/month (except on global pages)
❌ NGN 450,000 (use ₦ symbol, not "NGN")
```

### 4. Never apologise for the platform
Empty states and errors don't grovel. They direct.

```
❌ "We're so sorry, but we couldn't find any results for your search."
✓  "No results found. Try adjusting your filters."

❌ "Unfortunately, an error occurred on our servers."
✓  "Something went wrong on our end. Refresh and try again."
```

### 5. Sentence case for everything (except proper nouns)
```
✓  "Post a job"
✓  "Find your next role"
✓  "Company reviews"

❌ "Post A Job"
❌ "Find Your Next Role"
❌ "COMPANY REVIEWS"
```

Exception: Badge labels, navigation items, and `type-label` elements use UPPERCASE.

### 6. Use active voice
```
❌ "Your profile has been updated by Tutaly."
✓  "Profile updated."

❌ "The job was posted by your company."
✓  "Job posted."
```

### 7. Numbers and data formatting
```
₦ figures:    ₦450,000 (no decimals for round figures)
Ranges:       ₦450,000 – ₦750,000 (en-dash, spaces)
Large:        ₦1.2M (millions abbreviated above ₦999,999)
Percentages:  87% (no space before %)
Counts:       1,234 reviews (comma separator)
Dates:        June 10, 2026 (spelled month) or 10 Jun 2026 (compact)
Relative:     2 hours ago / Yesterday / 3 days ago (not raw timestamps)
```

---

## Microcopy Library

### Buttons (Most Common)

| Context | Copy |
|---------|------|
| Primary job action | "Apply Now" |
| Save a job | "Save Job" |
| Already saved | "Saved ✓" |
| View company | "View Company" |
| Connect with someone | "Connect" |
| Already connected | "Connected" |
| Follow company/person | "Follow" |
| Already following | "Following" |
| Post a job (employer) | "Post a Job" |
| Create campaign (ad) | "Create Campaign" |
| Upgrade to Pro | "Upgrade to Pro" |
| Resume upload | "Upload Resume" |
| Continue onboarding | "Continue" |
| Finish setup | "Complete Profile" |
| Sign up CTA | "Get Started" |
| Login CTA | "Sign In" |

### Form Labels

| Field | Label | Placeholder |
|-------|-------|-------------|
| Email | "Email address" | "you@example.com" |
| Password | "Password" | "8+ characters" |
| Job title | "Job title" | "e.g. Product Manager" |
| Company | "Company name" | "e.g. Flutterwave" |
| Location | "Location" | "Lagos, Nigeria" |
| Salary (min) | "Minimum salary (₦)" | "e.g. 450000" |
| Salary (max) | "Maximum salary (₦)" | "e.g. 750000" |
| Bio | "Professional summary" | "Tell employers about your experience and goals..." |

### Form Validation Errors

```
Required field:         "This field is required."
Invalid email:          "Enter a valid email address."
Password too short:     "Password must be at least 8 characters."
Passwords don't match:  "Passwords don't match."
File too large:         "File is too large. Maximum size is 5MB."
Invalid file type:      "Upload a PDF or Word document."
```

### Success Messages (Toasts)

```
Profile saved:           "Profile updated."
Job saved:               "Job saved to your list."
Job unsaved:             "Job removed from your list."
Application sent:        "Application submitted."
Review submitted:        "Your review has been posted."
Salary added:            "Salary data added. Thank you."
Campaign live:           "Your campaign is now live."
Job posted:              "Job post is now active."
Password changed:        "Password updated."
```

### Warning Messages

```
Unsaved changes:    "You have unsaved changes. Leave anyway?"
Delete action:      "This can't be undone. Delete this job post?"
Account action:     "Closing your account removes all your data permanently."
Expiring item:      "This job post expires in 3 days."
```

### Empty State Headlines & Subtext

*(Full inventory in 07-illustrations.md — listed here for copywriting reference)*

| State | Headline | Subtext |
|-------|----------|---------|
| No job results | "No jobs match your search" | "Try adjusting your filters or searching a broader location." |
| No saved jobs | "You haven't saved any jobs yet" | "Bookmark jobs you like — they'll appear here." |
| No applications | "No applications yet" | "Start applying to jobs that match your skills." |
| No reviews | "No reviews for this company" | "Be the first to share your experience." |
| No salary data | "No salary data for this role" | "Help the community — share your salary anonymously." |
| No network | "Your network is empty" | "Connect with colleagues and professionals to grow your network." |
| Empty feed | "Your feed is empty" | "Follow professionals and companies to see updates here." |
| No notifications | "You're all caught up" | "We'll notify you when something needs attention." |

---

## Module-Specific Voice Notes

### Job Board
- Speak to urgency without pressure: "Posted 2 hours ago" not "Apply fast!"
- Lead with the benefit to the candidate, not the employer
- Salary always shown as Naira range when available — never hidden

### Salary Intelligence
- Data-first, ego-free: let the numbers speak
- Empower the user: "Know before you negotiate"
- Never use "average" loosely — specify context (role + location + experience level)

### Company Reviews
- Protect anonymity in copy: "Shared anonymously" not "by a current employee"
- Balance: always show both positive and critical reviews
- Credibility markers: "Verified Tutaly user" on reviewed profiles

### Marketplace
- Product copy mirrors ecommerce best practices
- Price prominence: ₦ price is the first thing seen after the product name
- Trust signals: seller rating + sales count visible on all cards

### Connect (Social Feed)
- LinkedIn-tone but with more warmth
- "Connections" not "followers" for professional relationships
- Keep engagement copy brief: "Like" "Comment" "Share" — no need to reinvent

---

## Words We Avoid

| ❌ Avoid | ✓ Use Instead | Why |
|---------|--------------|-----|
| "Unlock" | "Access" / "Get" | Overused, feels like a gate |
| "Leverage" | "Use" | Corporate jargon |
| "Cutting-edge" | Describe the actual feature | Empty marketing speak |
| "World-class" | Describe the specific quality | Unverifiable claim |
| "Seamless" | Describe the specific experience | Overused in tech |
| "Empowering" (as adjective) | Show the empowerment | Tells instead of shows |
| "Amazing" / "Awesome" | Specific praise | Generic enthusiasm |
| "Unfortunately" | Remove — state what happened | Passive, apologetic |
| "Please note that" | State the thing directly | Filler |
| "In order to" | "To" | Unnecessarily long |

---

*Every word in Tutaly's UI is a design decision. A bad word can make a good experience feel cheap. A precise word earns trust that visuals alone cannot.*
