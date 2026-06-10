## TUTALY — COMPLETE 24-WEEK DEVELOPMENT ROADMAP

**Start Date:** April 14, 2026
**Launch Date:** Late September 2026

---

## WEEK 1 — April 14–20
### Infrastructure, Monorepo & Database Foundation

**DevOps / Infrastructure:**
- Create GitHub organisation and repository at github.com/tutalyng-cmd/Tutaly
- Set up GitHub Actions CI/CD pipeline — ci.yml that installs pnpm, runs lint, runs build on every push
- Configure branch protection rules on main — no direct pushes, CI must pass before merge
- Set up Supabase project — copy DATABASE_URL to .env
- Set up Upstash Redis — copy REDIS_URL to .env
- Create AWS S3 bucket (or Supabase Storage) — private bucket, configure IAM credentials
- Create SendGrid account — verify sender email tutalyhq@gmail.com, copy API key
- Create Google reCAPTCHA v3 keys — copy site key and secret key
- Set up Sentry project for error monitoring
- Set up UptimeRobot account for uptime monitoring
- Document all environment variables in .env.example with placeholder values and comments

**Backend (NestJS):**
- Initialise pnpm monorepo with pnpm-workspace.yaml
- Create apps/api — NestJS project with TypeScript strict mode
- Scaffold all 9 NestJS modules: auth, user, job, shop, connect, review, support, admin, database
- Each module gets: module.ts, controller.ts, service.ts, dto folder, entities folder
- Configure TypeORM in database.module.ts — connect to Supabase PostgreSQL with SSL
- Set synchronize: false immediately — never enable it again
- Create data-source.ts for TypeORM CLI
- Add migration scripts to package.json: migration:generate, migration:run, migration:revert, migration:show
- Implement all 25+ TypeORM entities:
  - User (id, email, password_hash, role, status, email_verified, date_of_birth, tos_agreed_at, username, full_name, avatar_url)
  - SeekerProfile (user_id FK, headline, bio, skills array, location, cv_url, profile_visibility, follow_approval, seller_status)
  - EmployerProfile (user_id FK, company_name, about, sector, company_size, website_url, logo_url, social_links JSONB, is_verified)
  - Job (id, employer_id FK, title, description, country, state, area, is_remote, work_mode, employment_type, salary_min, salary_max, salary_type, currency, industry, category, role, qualification, experience_level, apply_method, apply_url, deadline, status, is_featured, is_urgent, search_vector tsvector)
  - Application (id, job_id FK, seeker_id FK, status, cover_note, applied_at — UNIQUE job_id+seeker_id)
  - SavedJob (id, job_id FK, seeker_id FK, saved_at — UNIQUE job_id+seeker_id)
  - ReportedJob (id, reporter_id FK, job_id FK, reason, status)
  - CompanyReview (id, company_name, sector, position, department, rating_overall, rating_work_life, rating_pay, rating_management, rating_culture, pros, cons, recommend, display_name, submitter_hash, user_id FK nullable, status)
  - SalaryReview (id, industry, company, role, salary_amount, currency, salary_period, location, submission_year — NO user_id ever)
  - ShopCategory (id, name, slug, icon)
  - ShopSubcategory (id, category_id FK, name, slug)
  - ShopProduct (id, seller_id FK, category_id FK, subcategory_id FK, title, description, listing_type, pricing_type, price, price_unit, min_quantity, price_may_vary, file_s3_key, thumbnail_url, contact_phone, contact_whatsapp, status, is_work_related_confirmed)
  - Order (id, buyer_id FK, product_id FK, seller_id FK, amount_paid, commission_amount, seller_earnings, payment_ref UNIQUE, gateway, status, download_count)
  - QuoteRequest (id, product_id FK, buyer_id FK, seller_id FK, requirements, budget_range, deadline_requested, status, quoted_price, seller_notes, expires_at)
  - OrderDispute (id, order_id FK, raised_by FK, reason, evidence_urls, status, resolved_by FK, resolution_notes, resolved_at)
  - Post (id, author_id FK, content, image_url, likes_count, comments_count)
  - PostLike (post_id FK, user_id FK — UNIQUE)
  - PostComment (id, post_id FK, author_id FK, body)
  - Follow (follower_id FK, followee_id FK, status — UNIQUE follower+followee)
  - Message (id, sender_id FK, receiver_id FK, body, read_at)
  - Report (id, reporter_id FK, target_type, target_id, reason, status)
  - Notification (id, user_id FK, type, message, is_read, link)
  - LegalPage (id, slug UNIQUE, title, content, updated_by FK, updated_at)
  - Ad (id, advertiser_id FK, type, image_url, target_url, placement, starts_at, ends_at, status)
  - NewsletterSend (id, subject, body, audience, sent_by FK, sent_at, recipient_count)
  - SellerApplication (id, user_id FK, bio, category_focus, status, reviewed_by FK)
  - EmailVerification (id, user_id FK, token UNIQUE, expires_at, used_at)
  - PasswordReset (id, user_id FK, token UNIQUE, expires_at, used_at)
  - ProductRating (id, product_id FK, buyer_id FK, rating, comment — UNIQUE product+buyer)
- Generate InitialSchema migration from all entities
- Run migration against Supabase — verify all tables created
- Mark InitialSchema as run in migrations table
- Override outdated packages at root level (glob, inflight)

**Frontend (Next.js):**
- Initialise apps/web — Next.js 14 with App Router, TypeScript strict mode, Tailwind CSS
- Configure Tailwind with brand tokens: navy #0D1B2A, teal #1D9E75
- Set up Inter font from Google Fonts in layout.tsx
- Create route groups: (public), (auth), (dashboard)
- Build sticky top navigation bar — logo, nav links, Sign In + Post a Job buttons, mobile hamburger with slide-out drawer
- Build footer — 4-column link grid, all 12 legal page links, social icons, copyright
- Build Hero section — Navy background, mesh pattern, headline, search bar, dual CTAs

**Design:**
- Set up Figma workspace
- Create design system: colours, typography, spacing, component tokens
- Design navigation bar and footer components

---

## WEEK 2 — April 21–27
### Authentication System & Migration Infrastructure

**Backend:**
- POST /auth/register — seeker and employer roles, age 18+ validation, ToS timestamp logged, bcrypt 12 rounds, sends verification email via SendGrid
- POST /auth/verify-email — token validation, marks email_verified = true, issues JWT tokens
- POST /auth/login — credential validation, checks email_verified, issues access token (15min) + sets httpOnly refresh cookie (7d)
- POST /auth/refresh — validates refresh cookie, issues new access token, rotates refresh token in Redis
- POST /auth/forgot-password — generates reset token, sends SendGrid email, always returns 200 regardless of email existence (no enumeration)
- POST /auth/reset-password — validates token expiry + used status, bcrypt new password, marks token used, invalidates all refresh tokens in Redis
- GET /auth/me — returns current user profile from JWT payload
- PUT /auth/change-password — validates current password, bcrypt new password
- DELETE /auth/account — soft delete, anonymises personal data (name → Deleted User, email hashed), invalidates all sessions
- POST /auth/logout — revokes refresh token in Redis, clears httpOnly cookie
- JWT strategy — RS256 or HS256, payload: user_id, role, email, 15min expiry
- Refresh token strategy — stored in Redis with TTL matching cookie expiry, rotated on every use
- NestJS role guards — @Roles() decorator + RolesGuard for all protected routes
- JWT auth guard — @UseGuards(JwtAuthGuard) on all authenticated endpoints
- Google reCAPTCHA v3 server-side verification in register() — hits Google siteverify API with RECAPTCHA_SECRET_KEY, threshold 0.5
- MFA setup — mandatory for Employer and Admin accounts at database and service level
- Password complexity enforcement — @Matches regex: uppercase + lowercase + digit + special character + minimum 8 characters
- Age validation — date_of_birth must be 18+ at registration date
- Email enumeration prevention — forgot-password returns identical response regardless
- OTP generation using crypto.randomInt() — NOT Math.random()
- Global ValidationPipe with whitelist: true, forbidNonWhitelisted: true, transform: true in main.ts
- Helmet.js security headers in main.ts
- CORS configuration in main.ts — whitelist only Vercel frontend origin
- Rate limiting via @nestjs/throttler — 100 req/min global, 5 req/min on auth routes
- Input sanitisation on all user-generated content before DB write
- Redis-backed session management — TokenService for refresh token operations
- sameSite: strict on all cookie writes consistently

**Frontend:**
- Build Sign In page — email + password with show/hide toggle, Forgot Password link, Sign Up link, loading spinner state, inline error states
- Build Sign Up Step 1 — role selection cards (Job Seeker / Employer) with animated selection state, progress bar
- Build Sign Up Step 2a (Seeker) — Full Name, Email, Password with strength meter, Confirm Password, Date of Birth, Terms checkbox, reCAPTCHA
- Build Sign Up Step 2b (Employer) — Company Name, Full Name, Work Email, Password, Company Size dropdown, Terms checkbox, reCAPTCHA
- Build Sign Up Step 3 — Email Verification screen with envelope illustration, resend with 60-second countdown
- Build Forgot Password page — email input, submit, same-regardless success message
- Build Reset Password page — new password + confirm, strength meter, success redirect to Sign In
- Connect all auth forms to backend API endpoints
- Implement JWT token storage in React Context (NOT localStorage)
- Build Axios authenticated client with response interceptor for 401 auto-refresh
- Build Next.js middleware.ts — checks refresh token cookie, redirects unauthenticated users to /sign-in before dashboard renders

**CI/CD:**
- Resolve all TypeScript lint violations blocking pipeline
- Document warning baseline: apps/api warnings count + apps/web warnings count
- Keep no-explicit-any as strict ERROR — never downgrade
- Add chore/fix-typescript-strict task to task.md for Week 21

---

## WEEK 3 — April 28–May 4
### Jobs Module Backend + Public Pages

**Backend:**
- POST /jobs — create job (Employer only), validates all fields, status defaults to pending_review
- GET /jobs — public search with all 10 filters:
  - keyword (TSVector plainto_tsquery on title + description)
  - country, state, area (ILIKE on each level independently)
  - work_mode (ENUM filter)
  - employment_type (ENUM filter)
  - experience_level (ENUM filter)
  - industry (exact match)
  - salary_min and salary_max (numeric range filter)
  - date_posted (createdAt >= NOW() - interval 'X days')
  - is_featured (boolean filter)
  - Redis cache — 5min TTL, cache key includes all filter params hash
- GET /jobs/:id — job detail with ParseUUIDPipe validation, increments view_count
- PUT /jobs/:id — update job (Employer — own jobs only, status must be pending_review or active)
- DELETE /jobs/:id — soft delete (Employer own + Admin)
- PATCH /jobs/:id/approve — Admin only, status → active, Redis cache invalidated immediately, SendGrid email to employer
- PATCH /jobs/:id/status — Admin updates status (active/removed/expired)
- POST /jobs/:id/apply — Seeker only, checks resumeUrl exists in SeekerProfile, creates application, UNIQUE constraint prevents duplicates
- POST /jobs/:id/save — Seeker, saves to SavedJob table
- DELETE /jobs/:id/save — Seeker, removes SavedJob record
- POST /jobs/:id/report — Any auth, creates ReportedJob record
- GET /jobs/my-jobs — Employer's own listings with applicant counts
- GET /jobs/saved — Seeker's saved jobs
- GET /jobs/seeker/applications — Seeker's applications with full status pipeline
- GET /jobs/:id/applications — Employer's applicants for specific job (own jobs only)
- PATCH /jobs/applications/:id — Employer updates application status
- Route ordering fix — specific routes (my-jobs, saved, seeker/applications) must be registered BEFORE :id parameterized route in NestJS controller
- TSVector setup — raw Supabase SQL migration:
  - ALTER TABLE jobs ADD COLUMN search_vector tsvector GENERATED ALWAYS AS (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,''))) STORED
  - CREATE INDEX jobs_search_idx ON jobs USING GIN(search_vector)
- Performance indexes on: employer_id, status, industry, category, country, state, area, is_featured, is_urgent
- locations.json file — Nigeria (36 states + all LGAs and major areas per state) + UK structure for global expansion
- Seeker profile endpoints — GET /users/seeker/profile, PATCH /users/seeker/profile
- CV upload endpoint — POST /users/seeker/resume — PDF only + 5MB max, stored in Supabase Storage private bucket 'resumes', resumeUrl saved to SeekerProfile
- GET /jobs/seeker/applications — all 5 statuses: applied, reviewing, shortlisted, offered, rejected

**Frontend:**
- Build Home Page (SSR/ISR revalidate 300s):
  - Hero section with search bar wired to /jobs?keyword=X&country=Y navigation
  - Platform stats bar with count-up animation on scroll
  - Featured jobs carousel — fetches GET /api/jobs?isFeatured=true&limit=6
  - Browse by Industry grid — 12 tiles, each routes to pre-filtered jobs page
  - Company Reviews snapshot — 3 review excerpt cards
  - Salary Insights teaser — horizontal bar chart + CTA
  - Shop highlights — 3 product cards
  - Join Community CTA banner
- Build Jobs Page (SSR with searchParams):
  - 10-filter sidebar — all filters from spec
  - Cascading location dropdowns from locations.json
  - Job results list with sort bar and pagination
  - Split-panel detail view (LinkedIn style) — click job on left, details appear on right without navigation
  - URL query string sync — all filters reflected in URL, pre-populated on page load
  - "Apply Now" button — auth check: not logged in → /sign-in with return URL, logged in no CV → profile prompt, logged in with CV → submit application
  - All job card states: Featured (gold border), Urgent (red border), Saved (teal bookmark), Applied (green badge), Expired (gray + disabled apply)
- Build Seeker Dashboard:
  - Overview tab — welcome banner, 4 stats cards, recommended jobs, recent applications table
  - Saved Jobs tab
  - My Applications tab — visual pipeline stepper per application showing all 5 statuses
  - Profile tab — bio, skills tag input, headline, location, social links, CV drag-and-drop upload
- Build Employer Dashboard:
  - Overview tab — 4 stats cards, recent applicants table
  - Post a Job tab — multi-section form with all required fields
  - My Jobs tab — cards with status badges, kebab menu with Edit/Boost/Pause/Delete
  - Applicants tab — dropdown to select job, applicants table with CV download and status update
  - Company Profile tab — logo upload, about, sector, website, social links

---

## WEEK 4 — May 5–11
### Reviews, Salary Intelligence & Security Hardening

**Backend:**
- GET /reviews/companies — list all companies with review data, search by name, filter by sector, paginated
- GET /reviews/companies/:name — company profile with:
  - Aggregated overall star rating
  - Breakdown ratings for 4 categories (work-life, pay, management, culture)
  - Would Recommend percentage
  - List of approved reviews sorted by date
  - Redis cache 10min TTL
- POST /reviews — submit company review:
  - user_id added if authenticated, null if guest
  - All required fields validated via CreateReviewDto with @MaxLength constraints on pros, cons, companyName
  - submitter_hash = SHA-256 of (IP address + User-Agent) — stored internally, never exposed
  - Status defaults to pending — goes into admin moderation queue
  - reCAPTCHA v3 server-side verification
- POST /reviews/:id/report — any auth, creates Report record for this review
- PATCH /reviews/:id — Admin only, approve or reject, invalidates company cache on approval
- GET /salaries — aggregated salary data:
  - Required filter: industry
  - Optional: role, location, company
  - Returns: avg, min, max salary per role
  - Count of data points
  - Redis cache 30min TTL
- POST /salaries — submit salary data:
  - NO user_id stored — ever — fully anonymous by design
  - All fields validated
  - reCAPTCHA v3 server-side verification
  - Rate limit: 3 per IP per hour
- Employer company profile expansion:
  - GET /users/employer/profile
  - PATCH /users/employer/profile — company_name, about, sector, company_size, website_url, social_links JSONB
  - POST /users/employer/logo — logo upload to Supabase Storage, signed URL generation
  - PATCH /admin/employers/:id/verify — Admin toggles isVerified on employer profile
- P0 Critical security fixes from audit:
  - JWT access token expiry changed from 7d to 15min
  - OTP generation migrated to crypto.randomInt()
  - In-memory cart Map moved to Redis with cart:{userId} key, 24hr TTL, JSON serialization
  - unsafe-eval removed from CSP in next.config.ts
  - Batch order idempotency check — if (o.status !== OrderStatus.PENDING_PAYMENT) continue inside webhook loop
- P1 High security fixes:
  - Access token storage moved from localStorage to React Context/Zustand in-memory
  - Axios response interceptor — catches 401, calls /auth/refresh, retries original request with new token
  - onDelete: RESTRICT added to all Order foreign keys (buyer, seller, product) — generate migration
  - Logout function calls POST /auth/logout before clearing client state and redirecting
  - Email verification check added to login() — throws UnauthorizedException if !user.isEmailVerified
  - sameSite: strict standardised on all cookie writes (login, MFA verify, refresh)
  - Password complexity regex added to auth.dto.ts
- AuthenticatedRequest interface extracted to apps/api/src/common/types/request.ts — remove duplicates
- Junk files removed from repo — git rm --cached on lint-results.txt, test.html, duplicate lockfiles
- Global exception filter added — prevents raw stack traces from leaking in any environment

**Frontend:**
- Build Company Reviews Page (SSR):
  - Company search with autocomplete suggestions
  - Write a Review button — open to all users including guests
  - Company cards grid — logo/initials, star rating, review count, sector badge
  - Company Detail Page — header with rating breakdown bar chart, would-recommend %, review list
  - Individual review cards — pros (green border) + cons (red border) + recommend badge + report flag
  - Write a Review modal — all fields, rating sliders, CAPTCHA, success state
- Build Salary Reviews Page (SSR):
  - Filter bar — industry (required), role, location, company, Apply Filters button
  - Summary cards row — avg salary, min, max, data points count
  - Horizontal bar chart — min/median/max per role, teal fill, animated on scroll
  - Data table — sortable columns, paginated
  - Submit Salary panel — all fields, full anonymity note, CAPTCHA
  - Empty state for no data

---

## WEEK 5 — May 12–18
### Shop / Marketplace Backend Part 1

**Backend:**
- Seller onboarding flow:
  - POST /shop/seller/apply — creates SellerApplication record, status: pending
  - GET /shop/seller/status — returns current seller application status
  - PATCH /admin/sellers/:id — Admin approves or rejects, updates seller_status on SeekerProfile
  - Approved sellers get email notification via SendGrid
  - Seller guard — NestJS guard checks seller_status === approved before allowing product creation
- Shop category and subcategory setup:
  - Seed all categories from the master document (20+ top-level categories)
  - Seed all subcategories linked to parent categories
  - GET /shop/categories — returns full category tree
- Product/service/digital listing CRUD:
  - POST /shop/products — Approved Seller only, multipart form:
    - listing_type: digital | physical | service
    - pricing_type: per_unit | request_quote
    - If per_unit: price, price_unit, min_quantity required
    - price_may_vary toggle for services
    - For digital: file upload to Supabase Storage private bucket 'products'
    - For Other/Uncategorized: is_work_related_confirmed boolean required
    - thumbnail upload to Supabase Storage
  - GET /shop/products — public listing with filters: category, subcategory, listing_type, pricing_type, search, sort, page
  - GET /shop/products/:id — full product detail with seller info and ratings
  - PUT /shop/products/:id — Seller own product update (cannot change file — create new product)
  - DELETE /shop/products/:id — Seller own / Admin removal, status → removed
- Cart system (Redis-backed):
  - GET /shop/cart — reads cart:{userId} from Redis, returns product details
  - POST /shop/cart — adds item to cart:{userId} Redis list, 24hr TTL refresh on each add
  - DELETE /shop/cart/:product_id — removes specific item from cart
  - Cart validates products still exist and are active on read
- Checkout initiation:
  - POST /shop/checkout — validates cart, creates pending Order records for each item, initialises Flutterwave payment, returns Flutterwave payment link/data
  - Order status: pending_payment on creation
  - Order stores: buyer_id, product_id, seller_id, amount_paid, commission_amount (20%), seller_earnings (80%), gateway: flutterwave
- Flutterwave webhook:
  - POST /shop/webhook/flutterwave — receives webhook
  - Verifies Flutterwave-Signature HMAC-SHA512 against secret key — returns 401 if invalid
  - Idempotency check — if order already completed, return 200 without reprocessing
  - If valid and pending_payment:
    - Order status → completed
    - commission_amount = amount_paid × 0.20 recorded
    - seller_earnings = amount_paid × 0.80 recorded
    - For digital: signed download URL generated, buyer notified via email
    - For physical/service: seller contact details unlocked for buyer
    - Seller notified via SendGrid email
- Paystack webhook:
  - POST /shop/webhook/paystack — identical flow with Paystack HMAC-SHA512 verification
  - gateway field on Order set to paystack
- Payment abstraction layer:
  - PaymentGateway interface: initiatePayment(), verifyWebhook(), processRefund()
  - FlutterwaveGateway implements PaymentGateway
  - PaystackGateway implements PaymentGateway
  - StripeGateway stub implements PaymentGateway (for future global)
  - Gateway selector function: Nigeria default → Flutterwave, user choice → Paystack, international → Stripe
- Digital product downloads:
  - GET /shop/orders/:id/download — Buyer with paid order only
  - Generates signed Supabase Storage URL (1hr expiry)
  - Increments download_count on Order
  - Re-downloadable unlimited times — new signed URL each request
- My purchases:
  - GET /shop/my-purchases — all completed orders for buyer with download access or contact details
- Seller sales:
  - GET /shop/my-sales — seller's completed orders with commission breakdown, total earnings
- Old escrow code — kept as commented block in shop.service.ts with clear comment: ESCROW FALLBACK — DO NOT DELETE

**Frontend:**
- Build Shop Homepage (SSR):
  - Navy gradient header with search bar
  - Category navigation tabs — horizontal scroll, sticky on scroll
  - Product grid — 3 columns, all card variants (digital/physical/service badges)
  - Advertising banner placements (top + sidebars — placeholder for now)
- Build Product Detail Page:
  - 2-column layout — media + tabs left, purchase panel right
  - Seller mini-card with verified badge
  - Price display (fixed) or Request Quote button
  - Add to Cart + Buy Now buttons
  - Tabs: Description | Reviews | Seller Info | Delivery and Returns
  - Security payment note
- Build Cart Sidebar:
  - Slide-out from right
  - Item list with thumbnail, title, price, remove button
  - Subtotal + Proceed to Checkout button
- Build Checkout Page:
  - Order summary right panel
  - Billing details form: Full Name, Email, Phone
  - Flutterwave/Paystack payment widget
  - Place Order button

---

## WEEK 6 — June 2–8
### Shop Backend Part 2 — Quotes, Disputes & Seller Dashboard

**Backend:**
- Request-a-Quote flow:
  - POST /shop/quotes — Buyer submits quote request: product_id, requirements, budget_range (optional), deadline (optional)
  - QuoteRequest created with status: pending, expires_at = 7 days from creation
  - Seller notified via SendGrid
  - GET /shop/quotes — returns buyer's sent requests or seller's received requests depending on role
  - GET /shop/quotes/:id — single quote detail
  - POST /shop/quotes/:id/respond — Seller responds with quoted_price + seller_notes, status → quoted, buyer notified
  - POST /shop/quotes/:id/accept — Buyer accepts, status → accepted, checkout link generated, redirects to checkout
  - POST /shop/quotes/:id/reject — Buyer rejects, status → rejected, seller notified
  - Bull job: quote expiry checker — runs daily, marks stale quotes as expired, notifies both parties
- Order dispute flow:
  - POST /shop/orders/:id/dispute — Buyer raises dispute within 48hrs of order completion
  - Creates OrderDispute record, status: open
  - Order flagged for admin review
  - Seller notified
  - GET /admin/disputes — Admin views all open disputes
  - PATCH /admin/disputes/:id — Admin resolves:
    - decision: refund → Paystack/Flutterwave refund initiated, order status → refunded, buyer notified
    - decision: release → seller earnings confirmed, order status → resolved, seller notified
    - resolution_notes saved, resolved_by saved
- Product ratings system:
  - POST /shop/products/:id/rate — Buyer only, verified purchase required (must have completed order), 1-5 stars + optional comment
  - One rating per buyer per product — UNIQUE constraint
  - ProductRating entity
  - Aggregate rating recalculated on product after each new rating
- Seller earnings dashboard:
  - GET /shop/my-sales — paginated list of completed orders with:
    - Product title, buyer (anonymous username), amount, commission deducted, seller earnings, date
  - GET /shop/my-earnings/summary — total gross sales, total commission paid, total net earnings, pending amount
- Commission tracking:
  - All commission data stored per order
  - Super Admin revenue endpoints aggregate across all orders
- Physical product contact reveal:
  - After order completed, GET /shop/orders/:id/contact returns seller phone + WhatsApp
  - Only accessible by buyer of that specific order
  - Seller must have contactPhone set on their profile or the specific listing

**Frontend:**
- Build Order Confirmation Page:
  - Success illustration + Order reference
  - For digital: Download button + "Go to My Purchases" link
  - For physical/service: Seller contact card revealed (phone + WhatsApp click-to-call/message)
- Build My Purchases Page:
  - Table: Product | Date | Amount | Action
  - Digital: Download button (re-downloadable)
  - Physical/Service: View Seller Contact button
  - Rate Product button (post-purchase)
- Build Seller Dashboard:
  - My Listings tab — active listings with edit, pause, delete
  - Add Listing form — all listing types, pricing types, file upload for digital
  - Orders tab — pending and completed orders, mark delivered button
  - Earnings tab — summary cards + transaction table with commission breakdown
- Build Quote Request UI:
  - Request Quote form on product detail page (replaces Add to Cart for quote-type listings)
  - Quote management page — buyer sees sent quotes + seller responses
  - Accept/Reject quote UI
- Build Dispute UI:
  - Report Issue button on order confirmation and my purchases
  - Dispute form — reason + optional evidence upload
  - Dispute status tracker

---

## WEEK 7 — June 9–15
### Marketplace Backend Part 3 — Physical Products & Advanced Features

**Backend:**
- Physical order status tracking:
  - Order status flow for physical goods: pending_payment → completed → delivered → confirmed
  - PATCH /shop/orders/:id/delivered — Seller marks order as delivered (physical only)
  - PATCH /shop/orders/:id/confirm — Buyer confirms receipt (physical only)
  - Buyer notified when seller marks delivered
  - 48hr window starts after seller marks delivered — Bull cron job monitors and auto-confirms if no buyer response
- Bulk order support:
  - Minimum quantity enforcement on checkout — validates quantity >= min_quantity before creating order
  - Quantity field on cart items for per-unit listings
- Seller profile phone number:
  - contactPhone and contactWhatsapp fields added to SeekerProfile entity
  - Migration generated and run
  - These fields populate onto physical and service listing detail pages
  - Shown to buyer only after purchase — hidden behind payment wall before
- Work-related listing enforcement:
  - Admin moderation flag for listings in Other/Uncategorized category
  - is_work_related_confirmed must be true for these listings to be approved
  - Admin can remove non-compliant listings
- Seller subscription model (infrastructure):
  - seller_plan field on SeekerProfile: free | basic | premium
  - featured_until timestamp on ShopProduct
  - PATCH /shop/products/:id/feature — Seller pays to feature listing, sets featured_until
  - Featured listings appear at top of category results
- Product quick-view:
  - GET /shop/products/:id/preview — returns thumbnail, title, price, rating, seller name for modal preview
- Shop search performance:
  - Full-text search on product title and description using TSVector (same pattern as jobs)
  - Index on category_id, subcategory_id, listing_type, pricing_type, status, seller_id
  - Redis cache on GET /shop/products (5min TTL)

**Frontend:**
- Build Seller Application Form:
  - "Become a Seller" page — bio, category focus, sample work description, submit
  - Application status page — shows pending/approved/rejected with messaging
- Build Physical Order Tracking UI:
  - Order status stepper: Paid → Processing → Dispatched → Delivered → Confirmed
  - Seller "Mark as Delivered" button in orders dashboard
  - Buyer "Confirm Receipt" button in my purchases
- Build Product Quick-View Modal:
  - Hover on product card shows quick-view button
  - Modal: thumbnail, title, price, rating, seller, Add to Cart + View Full Listing buttons
- Build Featured Listings Display:
  - "Featured" badge on boosted products
  - Featured products appear at top of results with gold border accent

---

## WEEK 8 — June 16–22
### Connect / Networking Backend

**Backend:**
- Posts CRUD:
  - POST /connect/posts — creates post (text + optional image upload to Supabase Storage), any authenticated user
  - GET /connect/posts/:id — single post with comments
  - DELETE /connect/posts/:id — own post or Admin
  - POST /connect/posts/:id/report — any auth, creates Report record
- Feed system (fan-out on write):
  - After POST /connect/posts:
    - Bull job queued: fan-out-post with post_id + author_id
    - Worker fetches all followers with status: accepted from follows table
    - For each follower: ZADD their feed:{userId} sorted set in Redis, scored by timestamp, value = post_id
    - Feed TTL: 7 days per sorted set
  - GET /connect/feed — authenticated seeker or employer:
    - Reads feed:{userId} Redis sorted set (ZREVRANGE with pagination)
    - Fetches post details from PostgreSQL by post IDs
    - Falls back to direct PostgreSQL query for posts older than 7 days
- Likes and comments:
  - POST /connect/posts/:id/like — creates PostLike, increments likes_count (denormalised), notifies post author
  - DELETE /connect/posts/:id/like — removes PostLike, decrements likes_count
  - GET /connect/posts/:id/comments — paginated comments list
  - POST /connect/posts/:id/comments — creates PostComment, increments comments_count, notifies post author
  - DELETE /connect/posts/:id/comments/:commentId — own comment or Admin
- Follow system:
  - POST /connect/follow/:userId — creates Follow record:
    - If target user has follow_approval: auto → status: accepted immediately
    - If target user has follow_approval: manual → status: pending, target notified
  - PATCH /connect/follow/:requestId — target user accepts or rejects pending follow request
  - DELETE /connect/follow/:userId — unfollow, removes Follow record
  - GET /connect/followers — current user's accepted followers + pending requests
  - GET /connect/following — users current user is following (accepted only)
- Direct messages:
  - POST /connect/messages/:userId — creates Message record, receiver notified
  - GET /connect/messages/:userId — conversation thread between current user and userId, sorted by createdAt
  - PATCH /connect/messages/:userId/read — marks all messages from userId as read (sets read_at)
  - GET /connect/messages — list of all conversations (most recent message per thread)
- Discover people:
  - GET /connect/discover — suggested users to follow:
    - Excludes already followed users
    - Prioritises: same industry, same location, mutual connections
    - Returns 10 suggestions
- Post sharing:
  - Share to Feed — creates repost record linking to original post
  - Copy Link — returns canonical URL for the post
  - Share via WhatsApp — returns WhatsApp share URL: https://wa.me/?text=URL
  - Share via Twitter — returns Twitter share URL
- Saved posts:
  - POST /connect/posts/:id/save — saves post for current user
  - DELETE /connect/posts/:id/save — removes saved post
  - GET /connect/posts/saved — list of user's saved posts
- User profiles:
  - GET /connect/profiles/:username — public profile by @username
  - Returns: avatar, name, username, bio, posts count, followers count, following count, recent posts
- @username system:
  - Generated on registration: name_slug_XXXX (4 random digits)
  - UNIQUE constraint in users table
  - Searchable and linkable across Connect module

---

## WEEK 9 — June 23–29
### Admin Dashboard Backend Part 1

**Backend:**
- User management:
  - GET /admin/users — paginated, searchable, filterable by role and status
  - GET /admin/users/:id — full user profile with all associated data
  - PATCH /admin/users/:id — update status: active | suspended | deleted
  - Suspended users: cannot login, receive suspension email
  - Deleted users: soft delete, data anonymised
  - Bulk actions: POST /admin/users/bulk — suspend or delete multiple users
- Jobs moderation queue:
  - GET /admin/queue/jobs — all pending_review jobs with employer details
  - PATCH /admin/jobs/:id — approve (status → active + cache clear + employer email) or remove
  - GET /admin/jobs — all jobs with full filter (status, employer, date)
- Reviews moderation queue:
  - GET /admin/queue/reviews — all pending reviews with full content
  - PATCH /admin/reviews/:id — approve (publish) or reject
  - Edit capability: Admin can edit review text before approving
  - GET /admin/reviews — all reviews with status filter
- Sellers queue:
  - GET /admin/queue/sellers — pending seller applications
  - PATCH /admin/sellers/:id — approve or reject with optional reason
  - Approval: seller_status → approved on SeekerProfile, email notification sent
  - Rejection: rejection email with reason sent
- Reported content queue:
  - GET /admin/queue/reports — all unresolved reports (posts, jobs, reviews, users)
  - PATCH /admin/reports/:id — resolve: remove content | dismiss report
  - Removing content: soft deletes the target item
  - Bulk dismiss: mark multiple reports as dismissed
- Dispute resolution queue:
  - GET /admin/disputes — all open disputes with order and user details
  - PATCH /admin/disputes/:id — resolve with refund or release decision
  - Resolution triggers appropriate payment action
- Platform-wide notifications service:
  - NotificationService — centralized service called by all other modules
  - createNotification(userId, type, message, link) — creates Notification record
  - Event triggers:
    - Follow request received
    - Follow request accepted
    - Post liked
    - Post commented
    - Job application status changed
    - Job approved by admin
    - Order completed
    - Order disputed
    - Review approved
    - Seller application approved/rejected
    - New message received
  - GET /notifications — current user's notifications, sorted by date, paginated
  - PATCH /notifications/read-all — marks all as read
  - PATCH /notifications/:id/read — marks single notification as read
  - Unread count included in GET /auth/me response

---

## WEEK 10 — June 30–July 6
### Admin Dashboard Backend Part 2 — Revenue, Ads & Content Management

**Backend:**
- Revenue dashboard (Super Admin only):
  - GET /admin/revenue — gross revenue total, total commission earned, total seller payables, breakdown by gateway (Flutterwave vs Paystack vs Stripe)
  - GET /admin/revenue/transactions — paginated transaction table: Order ID, buyer username, product title, amount, commission, seller earnings, gateway, date, status
  - GET /admin/revenue/summary — monthly/weekly breakdown charts data
  - Revenue reconciliation: matches platform records against Flutterwave and Paystack transaction logs
- Analytics dashboard (Super Admin only):
  - GET /admin/analytics/users — user growth over time: total registrations by date, seekers vs employers breakdown, retention metrics
  - GET /admin/analytics/jobs — job stats: total posted, total applications, avg applications per job, top industries
  - GET /admin/analytics/transactions — transaction volume over time, avg order value, top selling products, top sellers
  - GET /admin/analytics/reviews — review submission rate, approval rate, top reviewed companies
- Advertising system:
  - GET /admin/ads — all ads with status filter: active | paused | expired
  - POST /admin/ads — create ad: type (banner | featured_job | sponsored), image_url, target_url, placement, starts_at, ends_at
  - PATCH /admin/ads/:id — update ad status or details
  - DELETE /admin/ads/:id — remove ad
  - GET /ads/active — public endpoint returning currently active ads by placement (for frontend rendering)
  - Ad placements: homepage_top | homepage_sidebar | jobs_sidebar | shop_top | connect_sidebar
  - Auto-expiry: Bull cron job checks ends_at daily, sets status → expired
- Commission management (Super Admin):
  - PATCH /admin/commission/rate — update platform commission rate (currently fixed at 20%)
  - GET /admin/commission/summary — total earned, per category breakdown, per seller breakdown
- Newsletter and email broadcast:
  - POST /admin/email/broadcast — sends via SendGrid to all users, seekers only, or employers only
  - Body: subject, rich text content, audience selection
  - Audience segmentation — queries users by role from database
  - Stores send record in NewsletterSend table with recipient_count
  - GET /admin/email/history — all previous broadcasts with open rate (if SendGrid tracking enabled)
- Email list management:
  - GET /admin/email/subscribers — all subscribed users with role and join date
  - PATCH /admin/email/subscribers/:id — unsubscribe user manually
  - Users can unsubscribe themselves via settings
- Legal pages CRUD:
  - GET /admin/legal — list all 12 legal pages with titles and last-updated dates
  - GET /admin/legal/:slug — get single page content
  - PUT /admin/legal/:slug — update content via WYSIWYG rich text editor, logs updated_by (admin user id) and updated_at timestamp
  - All 12 pages: terms-of-service, privacy-policy, disclaimer, community-guidelines, review-policy, marketplace-policy, refund-policy, advertiser-policy, employer-policy, cookie-policy, about-us, contact-us
- Platform announcements:
  - POST /admin/announcements — creates announcement that appears in Connect right sidebar and notification center
  - GET /announcements/active — public endpoint for frontend to fetch current announcements
- Cookie consent:
  - GET /admin/cookies/settings — returns current cookie policy settings
  - PATCH /admin/cookies/settings — admin updates cookie categories and descriptions

---

## WEEK 11 — July 7–13
### Settings Backend & User Account Management

**Backend:**
- Account settings:
  - PUT /users/settings/email — change email: validates current password, sends verification to new email, updates only after verification
  - PUT /users/settings/password — change password: validates current password, bcrypt new password, invalidates all other sessions
  - DELETE /users/account — account deletion: requires password confirmation, soft deletes, anonymises all personal data (name → Deleted User, email → hashed, avatar removed), invalidates all sessions, seller listings removed, active jobs removed
- Notification settings:
  - GET /users/settings/notifications — returns current notification preferences
  - PATCH /users/settings/notifications — update per-category toggles:
    - New jobs matching profile
    - Job application status changed
    - Review approved
    - New follower
    - Follow request
    - New message
    - Post liked
    - Post commented
    - Order updates
    - Platform announcements
- Privacy settings:
  - GET /users/settings/privacy — returns current privacy settings
  - PATCH /users/settings/privacy:
    - profile_visibility: public | connections_only
    - follow_approval: auto | manual
    - show_in_discover: boolean
    - show_salary_on_profile: boolean
- Cookie settings:
  - GET /users/settings/cookies — returns user's cookie consent choices
  - PATCH /users/settings/cookies — updates consent: analytics_cookies, marketing_cookies, functional_cookies
- Profile visibility enforcement:
  - GET /connect/profiles/:username — checks profile_visibility setting:
    - public: visible to everyone
    - connections_only: only visible to accepted followers
  - GET /connect/discover — respects show_in_discover = false, excludes these users

---

## WEEK 12 — July 14–20
### Frontend Part 1 — Public Pages

**Frontend:**
- All public pages must use Next.js SSR or SSG with proper meta tags for SEO
- Dynamic meta tags on every SSR page:
  - og:title, og:description, og:image, canonical URL, twitter:card
  - Jobs: og:title = job title + company name, og:description = first 150 chars of description
  - Companies: og:title = company name + avg rating
  - Products: og:title = product title + price
- Auto-generated sitemap.xml:
  - All active jobs
  - All company review pages
  - All shop products
  - All legal pages
  - Static routes
  - Submit to Google Search Console
- robots.txt — Disallow: /admin/, /api/, /dashboard/ | Allow: all public pages
- Build Home Page (final production version):
  - All 10 zones fully designed and connected to real API data
  - Advertising banner zone at top (renders active ads from /ads/active)
  - Count-up animation on stats bar
  - Featured jobs carousel with real data
  - Industry grid with job counts per industry
  - Reviews snapshot with real approved reviews
  - Salary teaser with real aggregated data
  - Shop highlights with real products
- Build Jobs Page (final production version):
  - Full SSR with all 10 filters in URL params
  - Pre-populated filters from URL on page load
  - Hero search wired correctly
  - All card states (featured, urgent, saved, applied, expired)
  - Infinite scroll on mobile
- Build Company Reviews Page (final):
  - SSR company list
  - Company Detail pages as dynamic SSR routes
  - Write a Review modal with full form
  - Report review functionality
- Build Salary Reviews Page (final):
  - SSR with filter params in URL
  - Interactive chart with real data
  - Submit salary modal with CAPTCHA
  - Empty state with submission CTA
- Build Legal Pages (×12):
  - Consistent template: Logo + title + last updated + table of contents + body + footer
  - All pages editable via admin WYSIWYG editor
  - All accessible from footer links
  - All linked to each other in footer
- Build Free Job Posting Landing Page:
  - Marketing copy explaining free tier
  - Feature comparison table: Free vs Premium
  - Inline quick-post form
  - CTA: Create Employer Account for Full Features
- Build Join Community Page:
  - Marketing page for Connect module
  - Platform stats, member testimonials (placeholder), sign up CTA
- Advertising display:
  - Banner ad component — renders image + links to target_url
  - Placed at: homepage top, jobs page sidebar, shop page top
  - Only renders if active ads exist for that placement

---

## WEEK 13 — July 21–27
### Frontend Part 2 — Auth Pages & Onboarding

**Frontend:**
- Build Sign In Page (final):
  - Connected to POST /auth/login
  - Inline field-level error states
  - Loading spinner on submit
  - Return URL handling — after login redirects back to attempted page
  - Remember me (optional — extends session awareness)
- Build Sign Up Flow (final):
  - Step 1: Role selection (Seeker / Employer) with animated card selection
  - Step 2a: Seeker registration form — all fields, password strength meter, 18+ DOB validation, Terms checkbox with timestamp, reCAPTCHA
  - Step 2b: Employer registration form — company fields, size dropdown, Terms checkbox, reCAPTCHA
  - Step 3: Email verification screen with 60-second resend cooldown
  - All connected to POST /auth/register
  - Progress bar showing current step
- Build Forgot Password Page:
  - Email input + submit
  - Always shows same success message regardless of email existence
- Build Reset Password Page:
  - Token validated on page load — redirect to Sign In if invalid/expired
  - New password + confirm password + strength meter
  - Connected to POST /auth/reset-password
  - Success → redirect to Sign In with "Password updated" toast
- Build Email Verification Success Page:
  - Shown after clicking verification link
  - "Email verified! Your account is now active." illustration
  - Redirect to dashboard button
- Cookie Consent Banner:
  - Appears on first visit, bottom of screen
  - "Accept All" + "Manage Preferences" + "Reject Non-Essential" buttons
  - Preferences modal: toggles for analytics, marketing, functional cookies
  - Choice saved to localStorage + POST /users/settings/cookies if authenticated
  - Banner dismissed once choice made, never shown again
- Role-based redirect after login:
  - Seeker → /dashboard/seeker
  - Employer → /dashboard/employer
  - Admin → /dashboard/admin
  - Super Admin → /dashboard/admin (with revenue tabs visible)

---

 ## WEEK 14 — July 28–August 3
Frontend Part 3 — Seeker Dashboard
Frontend:

Build Seeker Dashboard Layout:

Left sidebar with avatar, @username, profile completeness bar, all nav items
Top bar with greeting, notification bell (unread count badge), avatar dropdown
Mobile: bottom tab bar with 5 icons replacing sidebar


Build Overview Tab:

Welcome banner with personalised greeting
4 stats cards: Applications Submitted, Saved Jobs, Profile Views, Response Rate
Recommended Jobs section (3 job cards based on skills/industry)
Recent Applications table with status badges


Build My Applications Tab:

All applications with visual pipeline stepper per application
All 5 status values shown: Applied, Reviewing, Shortlisted, Offered, Rejected
Filter tabs: All | Applied | Reviewing | Shortlisted | Offered | Rejected
Application card shows job title, company, applied date, current status
Expand card to see full pipeline stepper


Build Saved Jobs Tab:

Grid of saved job cards
Remove from saved button
Direct apply button
Empty state with "Browse Jobs" CTA


Build Profile Tab:

Profile photo upload (circular, with edit overlay on hover)
Full name, headline, bio textarea
Skills tag input — type skill, press Enter, creates removable chip
Location fields (country, state, area cascading dropdowns)
Experience section — add/edit/delete work history entries (company, role, dates, description)
Education section — add/edit/delete education entries (institution, degree, dates)
Social links — LinkedIn, Twitter, Website
CV Upload zone:

Drag and drop area with dashed border
Accepts PDF only, max 5MB
Shows uploaded filename with replace and remove options
Progress indicator during upload
Connects to POST /users/seeker/resume




Build My Purchases Tab (Shop):

All completed orders
Digital: Download button, Rating button
Physical/Service: View Seller Contact button, Rating button


Build Account Settings Tab:

Change email section — input + verify button
Change password section — current + new + confirm
Delete Account section — warning text + confirm modal requiring password entry


Build Notification Settings Tab:

Toggle switches per notification category
Connected to PATCH /users/settings/notifications


Build Privacy Settings Tab:

Profile visibility toggle (Public / Connections Only)
Follow approval toggle (Auto / Manual)
Show in Discover toggle
Connected to PATCH /users/settings/privacy


Notification bell dropdown:

Appears in top bar across all dashboard pages
Shows last 10 notifications with read/unread states
Mark all read button
"View All Notifications" link
Real-time unread count badge




## WEEK 15 — August 4–10
Frontend Part 4 — Employer Dashboard
Frontend:

Build Employer Dashboard Layout:

Same structure as Seeker but with employer-specific nav items
Company logo in sidebar instead of personal avatar


Build Overview Tab:

4 stats cards: Active Jobs, Total Applicants, Job Views This Week, Applications This Week
Recent Applicants table: name, job title, applied date, status, View CV button
Quick actions: Post a Job, View All Jobs, View All Applicants


Build Post a Job Tab (final):

Multi-step form with progress stepper at top
Step 1 — Job Details:

Job Title (large input, 52px)
Description rich text editor (Bold, Italic, Bullet List, Numbered List, Link)
Employment Type radio pills
Work Mode radio pills
Salary Range toggle — when on: Min ₦ + Max ₦ + Period dropdown


Step 2 — Location & Requirements:

Cascading location dropdowns (country → state → area)
Experience Level radio pills
Qualification dropdown
Industry dropdown
Skills tag input


Step 3 — Application Settings:

Application deadline date picker
Apply Method: On Platform | External URL (text input appears if External URL)
Featured Job toggle (if employer has paid featured slots)
Urgent toggle


Submit for Review button — sticky on mobile
Confirmation: "Job submitted — under review within 24 hours"


Build My Jobs Tab (final):

Filter tabs: All | Pending Review | Active | Expired | Removed
Job management cards with:

Job title, posted date, view count, applicant count
Status badge with appropriate colour
Kebab menu: Edit | Boost to Featured | Pause | Delete


Empty state with Post a Job CTA


Build Applicants Tab (final):

Dropdown to select job
Applicants table: Name, @username, Applied Date, CV Download, Status
Status update dropdown per applicant: applied → reviewing → shortlisted → offered / rejected
Status change sends notification to applicant automatically
View CV button opens signed URL in new tab
Bulk status update (select multiple, change all)


Build Company Profile Tab (final):

Logo upload (circular, drag-and-drop)
Company Name, About (rich text), Sector dropdown, Company Size dropdown
Website URL, LinkedIn, Twitter
Verified badge shown if isVerified = true (admin-granted)
Save button — connected to PATCH /users/employer/profile


Build Featured Job Boost:

"Boost This Job" button on active jobs
Payment modal showing featured listing fee
After payment: job marked isFeatured = true, featured_until date shown


Build Employer Settings Tab:

Same account/notification/privacy settings as seeker
Additional: notification preferences for applicant activity




## WEEK 16 — August 11–17
Frontend Part 5 — Marketplace UI
Frontend:

Build Shop Homepage (final production):

All categories rendered from /shop/categories API
Category tabs with active state and horizontal scroll
Product grid connected to real data
Search functionality — debounced 300ms, updates results
Category drill-down navigation
Advertising banner at top (from /ads/active for shop_top placement)
Featured products section at top of grid


Build Product Detail Page (final):

Image gallery (multiple images if seller uploads more than one — Phase 2, single for now)
All tabs functional: Description, Reviews, Seller Info, Delivery and Returns
Fixed price display with unit and minimum quantity
Request Quote button for quote-type listings
Add to Cart + Buy Now wired to cart API
Seller mini-card with link to seller profile
Product ratings display — star average + count + individual rating cards below tabs


Build Cart Sidebar (final):

Real-time cart from Redis via API
Quantity adjustment for per-unit items
Cart total calculation
Empty cart state with Shop CTA


Build Checkout Page (final):

Order summary with item list
Billing details form — Full Name, Email, Phone
Payment method selection: Flutterwave | Paystack
Security badges and payment note
Place Order triggers checkout API → returns payment link → redirects to gateway


Build Order Confirmation Page (final):

Success animation
Order reference number
Digital: Download button (immediate access)
Physical/Service: Seller contact card (phone + WhatsApp link)
Rate product (available after 24hrs)
Go to My Purchases link


Build Seller Dashboard (final):

My Listings — all products with status, edit, pause, delete, boost
Add Listing form — complete form for all listing types with all pricing options
Orders — incoming orders with mark-as-delivered button for physical
Earnings — summary cards + full transaction table


Build Quote Request UI (final):

Request Quote form on product pages
My Quotes page — sent quotes (buyer) + received quotes (seller) tabs
Quote card: product, requirements, budget, status, quoted price (when received)
Accept/Reject buttons on received quotes


Build Dispute UI (final):

Report Issue button on order pages
Dispute form with reason and optional evidence upload
Dispute status tracker showing open/resolved state


Build Physical Order Tracking UI (final):

Horizontal stepper: Paid → Processing → Dispatched → Delivered → Confirmed
Seller marks delivered in their orders tab
Buyer confirms in My Purchases
48hr auto-confirm notice shown to buyer


Build Seller Application Page:

Clean form — bio, categories, sample work description
Application submitted state
Status checker page showing pending/approved/rejected




WEEK 17 — August 18–24
Frontend Part 6 — Connect / Networking UI
Frontend:

Build Connect Feed Page:

3-column layout desktop (sidebar + feed + right panel)
Single column mobile
Create Post box at top of feed — textarea + image upload icon + Post button
Post image upload — drag-and-drop, preview before posting, remove before posting
Feed renders paginated posts from /connect/feed API
Infinite scroll — loads next page when reaching bottom
Post card:

Avatar + Name + @username + Time ago + ⋯ options menu
Post content with text + optional image
Like button — fills Teal on click with count increment animation
Comment button — toggles comment section below post
Share dropdown: Share to Feed | Copy Link | WhatsApp | Twitter
Report option in ⋯ menu


Comment section (collapsible):

Thread of comments with avatars
Add comment input inline
Load more button


Empty feed state with "Follow people to see their posts" + Discover People CTA


Build Profile Page:

Cover photo (wide banner, uploadable by owner)
Avatar overlapping cover photo (bottom left)
Name + @username + Bio + Location
Follow/Unfollow button (not shown on own profile)
Message button
Stats row: Posts | Followers | Following
Edit Profile button (own profile only)
Posts grid below stats
Pending Follow Requests section (own profile, if follow_approval = manual):

List of pending requesters with Accept and Reject buttons




Build Discover People Page:

Grid of suggested user cards
Each card: avatar, name, @username, bio snippet, mutual connections count, Follow button
Follow button changes to "Following" after click
Search people by name or @username


Build Messages (DM) Page:

2-panel layout: conversation list (left) + chat window (right)
Conversation list: avatar, name, last message preview, timestamp, unread count badge
Chat window: speech bubble messages, blue for sent, gray for received
Message input + Send button + Emoji picker (basic)
Real-time appearance (optimistic updates — message shows immediately, confirmed on API response)
Empty state: "No messages yet. Find someone to connect with."


Build Notifications Page:

Full list of all notifications
Each notification: icon (based on type), message text, time ago, read/unread state
Unread notifications: slightly highlighted background
Mark All Read button at top
Click navigates to relevant content (job, post, profile, order)


Build Notification Bell Dropdown (in top navbar across all pages):

Bell icon with unread count badge
Dropdown shows last 10 notifications
Mark all read button
"View All" link to full notifications page


My Posts Tab (in Connect sidebar nav):

Grid/list of current user's own posts
Edit and Delete options per post


Saved Posts Tab (in Connect sidebar nav):

List of posts user has saved
Unsave button per post


Right Sidebar components:

People You May Know — 3-4 profiles with Follow buttons
Platform announcements — rendered from /announcements/active
Trending industries or topics (Phase 2 — placeholder for now)




WEEK 18 — August 25–31
Frontend Part 7 — Admin Dashboard UI
Frontend:

Build Admin Dashboard Layout:

Wide dark Navy left sidebar (260px)
All nav sections: Overview, Moderation, Platform, Finance, Settings
Top bar with Admin Panel label, notification bell, admin name and avatar
Responsive — sidebar collapses on tablet


Build Overview Tab:

KPI cards row: Total Users, Active Jobs, Pending Moderation Items, Revenue This Month (Super Admin)
Line chart: User signups over last 30 days (seekers vs employers) — using Recharts or Chart.js
Quick action buttons: Review Queue, Approve Sellers, Broadcast Email


Build Users Tab:

Searchable filterable data table
Columns: User ID, Name, Email, Role, Status, Joined Date
Row actions: View Profile, Suspend, Activate, Delete
Bulk select with Suspend Selected / Delete Selected
User detail modal: full profile, activity summary, action buttons


Build Jobs Moderation Tab:

Table: Job Title, Employer, Submitted Date, Status
Filter: Pending | Active | Expired | Removed
Actions per row: Approve, Remove, View Details
Job detail preview panel (same as public job detail but with admin actions)


Build Reviews Moderation Tab:

Moderation queue table: excerpt, company, nickname, date
Actions: Approve, Reject, Edit (opens edit modal)
Tabs: Pending | Approved | Rejected
Edit modal: WYSIWYG review text editor before approving


Build Sellers Tab:

Seller applications queue
Columns: Applicant Name, Date Applied, Category Focus, Bio Preview
Actions: Approve, Reject (with reason input)
Active sellers table: Name, Products Listed, Total Sales, Status
Product management table: Title, Seller, Category, Price, Status, Remove action


Build Disputes Tab:

Open disputes table: Order ID, Buyer, Seller, Product, Amount, Date Raised, Reason
Actions: Refund Buyer, Release to Seller
Resolution notes input before confirming decision
Resolved disputes tab with history


Build Reports Tab:

Reported content queue: type (post/job/review/user), reporter, reason, date
Actions: Remove Content, Dismiss Report
Bulk dismiss button


Build Revenue Tab (Super Admin only):

Gross revenue card, total commission card, seller payables card
Revenue by gateway breakdown (Flutterwave vs Paystack pie chart)
Transactions table: all columns + export to CSV button
Monthly revenue line chart


Build Analytics Tab (Super Admin only):

User growth line chart (daily/weekly/monthly toggle)
Jobs posted bar chart by week
Top industries donut chart
Transaction volume over time
Top selling products table
Top sellers leaderboard


Build Advertising Tab:

Active ads table with preview, placement, dates, status
Create Ad form: type, image upload, target URL, placement, date range
Edit ad modal
Ad performance metrics placeholder (impressions, clicks — Phase 2)


Build Legal Pages Tab:

List of all 12 pages with title and last updated date
Edit button opens WYSIWYG rich text editor
Save button + confirmation toast
Last updated by and timestamp shown


Build Email and Newsletters Tab:

Compose form: Subject, Body (rich text editor), Audience dropdown, Send Now or Schedule toggle
Schedule date/time picker (if Schedule selected)
Send History table: Subject, Audience, Sent By, Date, Recipients Count


Build Settings Tab:

Platform commission rate display (currently 20%)
Cookie policy settings management
Platform announcement creation
Admin account settings




WEEK 19 — September 1–7
SEO, Performance & Core Web Vitals
Frontend & Backend:

Dynamic Open Graph meta tags on all SSR pages:

Home: platform name + tagline + og:image (platform preview graphic)
Jobs page: "Jobs in Nigeria | Tutaly" + description
Each job post: job title + company + location + salary in meta description
Company review pages: company name + avg rating + review count
Shop products: product title + price + category
All legal pages: page title + Tutaly


Structured data (JSON-LD) for Google Jobs:

JobPosting schema on each job detail page
Enables Google Jobs rich results (green "Apply" button in search results)


Auto-generated sitemap.xml:

Dynamic routes: all active jobs, all company review pages, all shop products
Static routes: all legal pages, home, jobs, reviews, salaries, shop, community
Submit to Google Search Console
Auto-updates when new jobs go live, new products added, new reviews published


robots.txt:

Disallow: /admin/, /api/, /dashboard/, /auth/
Allow: all public pages
Sitemap reference link


Core Web Vitals optimisation:

LCP < 2.5s — critical for Nigeria on 4G:

Hero section image/pattern preloaded
Critical CSS inlined
Fonts preloaded with font-display: swap


CLS < 0.1:

All images have explicit width and height
Skeleton loaders instead of layout-shifting content
Fonts loaded before render


FID < 100ms:

Heavy components lazy-loaded with next/dynamic
Third-party scripts (reCAPTCHA, Flutterwave widget) loaded asynchronously




Image optimisation:

All images use Next.js Image component — automatic WebP conversion, lazy loading, responsive sizes
Thumbnails served via Supabase Storage CDN with size transformation
Avatar images: 200px max, WebP
Product thumbnails: 400px max, WebP


API response caching review and tuning:

GET /jobs: 5min Redis TTL — verified
GET /reviews/companies: 10min Redis TTL — verified
GET /salaries aggregates: 30min Redis TTL — verified
GET /shop/products: 5min Redis TTL — verified
Redis SCAN replace redis.keys() for cache invalidation — prevent O(n) blocking


Bundle size analysis:

Run next build --analyze
Identify and split large chunks
Lazy load heavy components (rich text editor, chart library, date picker)


Skeleton loading states:

Job cards skeleton — prevents layout shift while jobs load
Dashboard stats skeleton
Feed posts skeleton
Product grid skeleton


Prefetching:

next/link with prefetch on all major navigation links
Job detail prefetch on hover over job card




WEEK 20 — September 8–14
Security Hardening & Technical Debt Resolution
Security:

Fix all 61 TypeScript warnings — chore/fix-typescript-strict:

apps/api: 49 warnings in job and user modules — properly type all TypeORM query results and service return values
apps/web: 12 warnings — properly type all API response shapes and component props
Target: zero warnings, zero errors in pnpm -r run lint after this week


Complete P2 Medium security fixes from audit:

CORS updated to array supporting both https://tutaly.com and https://www.tutaly.com
CSP connect-src — remove localhost, replace with actual API domain
Redis SCAN iterator replacing redis.keys() — O(1) cache invalidation
Email verification check enforced on every login
sameSite: strict verified consistent across all cookie operations


Complete P3 Low security fixes:

ParseUUIDPipe added to all :id parameters in all controllers
Shared AuthenticatedRequest type verified imported everywhere (no duplicates)
Global exception filter — custom filter ensures no stack traces in any environment
All junk files removed from repo if any remain


Full security audit re-run:

Re-audit all auth endpoints — zero vulnerabilities
Re-audit all payment endpoints — HMAC verified, idempotency working
Re-audit all admin endpoints — role guards on every route
Re-audit all file upload endpoints — MIME type validation, size limits


Rate limiting verification:

100 req/min per IP global — test with load tool
5 req/min on all /auth/ routes — test brute force prevention
3 per IP per hour on review and salary submissions — test


CAPTCHA verification on all public forms:

Registration — verified
Review submission (guest + auth) — verified
Salary submission — verified
Contact form — verified
Forgot password — add if not already present


Flutterwave HMAC testing with live credentials:

Test valid webhook signature accepted
Test invalid signature returns 401
Test replay prevention (same webhook twice — second ignored)
Test batch order idempotency


Paystack HMAC testing with live credentials:

Same tests as Flutterwave


Complete 22-item MVP checklist — verify every item:

User registration (seeker + employer) with email verification
Employer job posting → admin approval → live on jobs page
Job search with all 10 filters
Company review submission (guest + user) → moderation → publish
Salary submission + aggregated display
Shop: listing upload, cart, payment checkout, download
Shop: Quote request → seller responds → buyer accepts → payment
Shop: Buyer confirmation window + auto-release
Shop: Dispute flow → admin resolution
Admin dashboard: all moderation queues
All 12 legal pages published
Legal pages editable in admin WYSIWYG
Connect: post, like, comment, follow, DM
Password reset flow end-to-end
Rate limiting + CAPTCHA on all public forms
HTTPS enforced + security headers verified
Flutterwave + Paystack webhooks tested with live keys
Database backup system active and tested
Mobile responsive across all screen types
Sentry error monitoring active
Privacy Policy and Terms reviewed by legal counsel
Marketplace Policy and Refund Policy published




WEEK 21 — September 15–21
Staging Deployment & User Acceptance Testing
DevOps:

Provision VPS server:

Install Ubuntu 24 LTS
Install Node.js 20 LTS
Install PostgreSQL 16
Install Redis 7
Install Nginx
Install PM2 for process management
SSH key-based access only — no password authentication
Fail2ban configured on SSH
UFW firewall — only ports 80, 443, 22 (restricted IP) open


PostgreSQL migration from Supabase to VPS:

pg_dump from Supabase
pg_restore to VPS PostgreSQL
Verify all tables, data, and indexes correctly migrated
Set up PostgreSQL read replica for GET-heavy queries
Automated daily pg_dump to AWS S3 backup bucket — 30-day retention
Weekly backup integrity test — restore to staging and verify


AWS S3 migration from Supabase Storage:

Create production S3 bucket (private)
Configure IAM user with minimal required permissions
Migrate all existing files: resumes, logos, product files, thumbnails
Update all S3 keys/paths in database to reflect new bucket
Verify signed URL generation works from new S3 bucket


Nginx configuration:

Reverse proxy to NestJS API (port 3001)
SSL termination (behind Cloudflare)
Gzip compression enabled
Rate limiting at Nginx level as secondary protection


Cloudflare setup:

Add domain to Cloudflare
Configure DNS records (A records for API server, CNAME for Vercel frontend)
SSL/TLS mode: Full (strict)
Enable DDoS protection rules
Configure caching rules for static assets
Page rules for API routes (no cache)


Vercel production deployment:

Connect GitHub repo to Vercel
Configure environment variables in Vercel dashboard
Set up custom domain
Enable Vercel Analytics for Core Web Vitals monitoring
Preview deployments enabled for all branches


Environment variables — production .env:

DATABASE_URL pointing to VPS PostgreSQL
REDIS_URL pointing to Upstash (or self-hosted Redis on VPS)
All API keys updated to live/production values
NODE_ENV=production
Cloudflare origin secret for authenticated pull


Sentry production setup:

Source maps uploaded for production builds
Error alerts configured
Performance monitoring enabled
Alert thresholds set


UptimeRobot configuration:

Monitor all key API endpoints every 5 minutes
Monitor frontend every 5 minutes
Alert channels: email + Slack/WhatsApp
PagerDuty integration for downtime > 2 minutes



Testing:

End-to-end testing on staging environment:

Complete Job Seeker journey: register → verify → complete profile → search jobs → apply → track application
Complete Employer journey: register → verify → complete company profile → post job → review applicants → update status
Complete Shop journey (digital): browse → add to cart → checkout → download
Complete Shop journey (physical): browse → checkout → seller delivers → buyer confirms → auto-release
Complete Quote journey: request quote → seller responds → buyer accepts → checkout
Complete Review journey: guest submission → admin approval → published
Complete Connect journey: follow → feed → post → like → comment → DM
Complete Admin journey: moderate job → approve review → resolve dispute → send newsletter


Load testing:

Simulate 100 concurrent users on jobs search
Simulate 50 concurrent users on shop browsing
Verify Redis cache is serving requests (not hitting PostgreSQL on every call)
Identify and fix any bottlenecks


Mobile testing:

Test on Android Chrome (most common in Nigeria)
Test on iOS Safari
Test on slow 3G connection simulation
All interactive elements meet 44px minimum touch target


Bug fix sprint:

All bugs found during UAT resolved before proceeding
Regression testing after bug fixes




WEEK 22 — September 22–28
Final Testing, Polish & Production Launch
Final QA:

Full regression test of all 22 MVP checklist items on production environment
Final Lighthouse audit on all public pages — target score 90+ on Performance, SEO, Accessibility
Cross-browser testing: Chrome, Firefox, Safari, Edge
Final mobile responsiveness check on all 18+ screen types
Payment live testing:

Real ₦100 test transaction on Flutterwave production
Real ₦100 test transaction on Paystack production
Verify commission deducted correctly
Verify seller credited correctly
Verify download accessible for digital product
Verify contact details revealed for physical product


Email delivery testing:

Registration verification email — delivered and functional
Password reset email — delivered and functional
Job approval email to employer — delivered and functional
Order confirmation email — delivered and functional
Seller approval email — delivered and functional


Final security scan:

Run npm audit — zero high/critical vulnerabilities
Verify all security headers present on production (Helmet.js)
Verify HSTS header active
Verify CSP header active with no unsafe-eval
Confirm no sensitive data in API responses or logs



Launch:

DNS fully propagated and stable
SSL certificate active and valid
All 12 legal pages published with final content from lawyer
All environment variables confirmed in production
Database backup verified working on production
Sentry receiving production errors
UptimeRobot monitoring active
Final smoke test — one complete user journey each role (seeker, employer, seller, admin)
Platform goes live — announce on social media, send launch newsletter
Monitor error rates and performance metrics closely for first 48 hours
On-call availability for first week post-launch


ONGOING POST-LAUNCH (Week 23+)
Immediate priorities after launch:

Monitor Sentry for any production errors — fix within 24hrs
Respond to first user feedback and bug reports
Performance monitoring — any pages below 90 Lighthouse score
Review first batch of jobs, reviews, and seller applications in admin queue
Seed platform with initial company reviews (encourage early users)
Outreach to Nigerian companies to post jobs

Phase 2 planning (post-launch):

Elasticsearch upgrade for advanced search
Real-time notifications via WebSockets
Mobile app (React Native)
Stripe integration for global expansion
Video upload support for Connect posts
Advanced analytics and reporting
API for third-party integrations
Elasticsearch for advanced search
Microservices extraction from NestJS monolith


TOTAL: 22 weeks of active development + launch
Start: April 14, 2026
Launch: Late September 2026You said: rewrite the brand identity also the project is not for only nigerians if possible stitch can make the ui ux design on a top notch level and it should reference…Tutaly_Stitch_Design_Prompt.mdmdrewrite the brand identity also the project is not for only nigerians if possible stitch can make the ui ux design on a top notch level and it should reference already made sites taht are similar to this projectJun 5Claude responded: Now I can see the actual logo.Now I can see the actual logo. The brand identity needs a complete rewrite. The logo tells a completely different story from what was originally documented. Let me analyse it first:
What the logo reveals:

Three vertical bars in Red, Green, Blue, and Gold/Yellow — these are the colours of the Nigerian flag with a gold accent, but arranged in a way that feels international and modern
Clean white wordmark "Tutaly" in a rounded sans-serif — not Inter, something softer
Dark background (#1A1A1A approximately) — not Navy
The bars suggest diversity, multiple pillars, strength, progression
The overall feel is: premium, global, confident, tech-forward

This is a completely different brand from what was specified. The original prompt said Deep Navy + Teal. The actual brand is Dark + Multicolour accent system. The Stitch prompt needs to be rewritten entirely.Completely rewritten Tutaly Stitch design prompt based on actual logoCompletely rewritten Tutaly Stitch design prompt based on actual logoYou said: continuecontinueJun 5Claude responded: Here is your completely rewritten Version 2 Stitch prompt.Presented filePresented fileHere is your completely rewritten Version 2 Stitch prompt. Here is what changed and why:
Major changes from Version 1:
Brand identity completely rebuilt from the logo:
The original prompt used Deep Navy + Teal as the brand. But your actual logo uses a four-colour system — Red, Green, Blue, and Gold bars against a dark charcoal background. The entire colour system has been rebuilt around those four colours with each one carrying a specific meaning throughout the UI. Blue for primary actions, Green for success and earnings, Gold for premium and warnings, Red for urgent and errors.
Background colour corrected:
The original prompt used #0D1B2A (navy). Your logo background is #1A1C1E (dark charcoal). Every dark surface has been updated to match.
Typography upgraded:
Switched from Inter to Plus Jakarta Sans which better matches the rounded, premium feel of your wordmark. JetBrains Mono added for salary figures and data numbers.
Global positioning added:
The original prompt said Nigeria-first. Version 2 reflects what you said — the platform is global. The hero now says "Now Available Globally" and the design references international salary formats (₦ and $), global job locations, and international placeholder content.
Reference sites added:
Stitch now has 15 specific reference platforms to study before designing — Paystack, Fiverr, Glassdoor, Levels.fyi, Jiji.ng, LinkedIn, Linear, Notion — so it understands exactly the quality benchmark required.
One important thing to update in your codebase:
Since the brand colours have changed, tell your developer to update tailwind.config.ts:
typescriptcolors: {
  brand: {
    dark:   '#1A1C1E',
    blue:   '#1B4F9E',
    green:  '#1D7A3A',
    gold:   '#C9A227',
    red:    '#CC2B2B',
  }
}
And update the AGENTS.md brand tokens section to reflect the new colour system so future model switches use the correct colours.Tutaly stitch prompt v2Document · MD DownloadYou said: hello i need you to explain how the ads stuff will work in this tutaly project where ads will appear when a users runs an ads etc.hello i need you to explain how the ads stuff will work in this tutaly project where ads will appear when a users runs an ads etc.8:17 AMClaude responded: Great question.Great question. Let me break down the complete advertising system for Tutaly from end to end.

HOW ADVERTISING WORKS ON TUTALY
There are two completely different types of advertising on the platform. You need to understand both clearly before building.

TYPE 1 — SELF-SERVE ADS (Businesses advertising ON Tutaly)
This is where external companies pay Tutaly to show their ads to Tutaly's users. Think of how Google shows ads, or how LinkedIn shows sponsored content.
Who buys these ads:

Nigerian companies wanting to reach professionals
Recruitment agencies
Training and certification companies
HR software companies
Banks and financial services targeting professionals
Any business wanting to reach the Tutaly audience

Ad formats available:
FormatWhere It AppearsSizeDescriptionBanner AdTop of home page, top of jobs page, top of shopFull width, 90px heightStandard billboard-style bannerSidebar AdRight sidebar on jobs page, connect feed300×250pxBox ad in sidebarSponsored JobMixed into job search resultsSame as job cardLooks like a job card but labelled "Sponsored"Sponsored ProductMixed into shop product gridSame as product cardLooks like a product but labelled "Sponsored"Connect Sidebar AdRight panel of Connect feed300×200pxSmall ad in networking section
Where each ad placement appears:
Home Page:
  → Full-width banner at very top (above hero or below nav)
  → "Sponsored" section between platform stats and featured jobs

Jobs Page:
  → Banner at top of results
  → Every 8th card in the results list is a sponsored job
  → Right sidebar ad box

Shop Page:
  → Banner at top of shop
  → Every 6th product card is a sponsored product

Connect Feed:
  → Right sidebar ad box
  → Every 10th post in feed is a sponsored post

Company Reviews Page:
  → Sidebar ad

HOW AN ADVERTISER RUNS AN AD — STEP BY STEP
Step 1 — Advertiser contacts Tutaly
For Phase 1, this is manual. Advertisers email tutalyhq@gmail.com or fill a contact form saying they want to advertise.
Later (Phase 2) you build a self-serve ad portal where advertisers create and pay for ads themselves.
Step 2 — Admin creates the ad in the dashboard
The admin logs into the Admin Dashboard, goes to the Advertising tab and fills:
Ad Type:         Banner | Sidebar | Sponsored Job | Sponsored Product
Image/Creative:  Upload the banner image or sponsored card content
Target URL:      Where clicking the ad goes (advertiser's website or job)
Placement:       Which page/position it appears on
Start Date:      When it goes live
End Date:        When it stops showing
Status:          Active | Paused | Expired
Budget/Impressions: (Phase 2 — for now admin controls manually)
Step 3 — Ad goes live
Once admin sets status to Active and the start date is reached, the ad automatically appears in its designated placement on the platform.
Step 4 — Ad expires
When the end date passes, a Bull cron job runs daily and automatically sets the ad status to Expired. It disappears from the platform.

TYPE 2 — EMPLOYER FEATURED JOBS (Internal Promotion)
This is different from external advertising. This is where employers already on Tutaly pay to make their job listings more visible.
How it works:
Regular job:  Appears in normal search results order (by date, relevance)
Featured job: Appears at the TOP of search results with a gold "⭐ Featured" badge
              Also appears in the Featured Jobs carousel on the home page
              Also gets a gold left border on the job card
How an employer features a job:

Employer posts a job (free)
Job gets approved by admin
Employer goes to My Jobs tab
Clicks "Boost This Job" on any active listing
Payment modal appears showing the featured listing fee (e.g. ₦5,000 for 7 days)
Employer pays via Flutterwave or Paystack
Webhook confirms payment → job.isFeatured = true, featured_until date set
Job appears at top of results and in homepage carousel

Featured job pricing tiers (suggestion):
PlanDurationPriceVisibilityBasic Boost7 days₦5,000Top of search resultsStandard Boost14 days₦8,500Top results + homepage carouselPremium Boost30 days₦15,000Top results + homepage + email newsletter mention

TYPE 3 — SELLER FEATURED LISTINGS (Internal Shop Promotion)
Same concept but for the marketplace. Sellers pay to feature their products or services.
How it works:
Regular listing:  Appears in normal shop grid order
Featured listing: Appears at top of category with "Featured" badge
                  Also appears in homepage Shop Highlights section
How a seller features their listing:

Seller has an approved active listing
Goes to their Seller Dashboard → My Listings
Clicks "Boost Listing" on any listing
Pays the featured listing fee
Listing appears at top of its category for the paid duration


HOW ADS ARE DISPLAYED TECHNICALLY
Backend — how ads are served:
GET /ads/active?placement=homepage_top

Returns:
{
  id: "uuid",
  type: "banner",
  image_url: "signed-s3-url",
  target_url: "https://advertiser-website.com",
  placement: "homepage_top"
}
The frontend calls this endpoint on page load. If an active ad exists for that placement, it renders. If no ad exists, that placement simply shows nothing — it does not leave a blank space.
Frontend — rendering logic:
typescript// On home page load (Server Component)
const ad = await fetch('/api/ads/active?placement=homepage_top')

// In JSX
{ad && (
  <a href={ad.target_url} target="_blank" rel="noopener sponsored">
    <img src={ad.image_url} alt="Advertisement" />
    <span className="ad-label">Sponsored</span>
  </a>
)}
Every ad must show a small "Sponsored" or "Ad" label — this is both a legal requirement and platform trust practice.
The database structure:
ads table:
  id              UUID
  advertiser_id   FK → users (if the advertiser has an account) or null
  type            ENUM: banner | sidebar | sponsored_job | sponsored_product
  image_url       S3 path (for banner/sidebar)
  target_url      Where clicking goes
  title           For sponsored job/product cards
  placement       WHERE it shows: homepage_top | jobs_sidebar | shop_top | connect_sidebar | jobs_results
  starts_at       DateTime
  ends_at         DateTime
  status          ENUM: active | paused | expired | pending_review
  impression_count INT (incremented each time ad is shown)
  click_count      INT (incremented each time ad is clicked)
  created_by      FK → admin user who created it

AD ANALYTICS (Admin Can Track)
For each ad the admin dashboard shows:
MetricWhat it meansImpressionsHow many times the ad was shown to usersClicksHow many users clicked the adCTR (Click-Through Rate)Clicks ÷ Impressions × 100 — e.g. 2.4%DurationHow many days it has been runningStatusActive / Paused / Expired
This data helps Tutaly prove value to advertisers and justify renewing their campaigns.

AD REVENUE MODEL
How Tutaly makes money from ads:
Revenue TypeModelExample PriceBanner adFlat fee per campaign duration₦50,000 for 30 daysSidebar adFlat fee per campaign₦30,000 for 30 daysSponsored job slotsPer job per duration₦15,000 for 30 daysSponsored product slotsPer listing per duration₦10,000 for 30 daysFeatured job boostPer job per duration₦5,000–₦15,000Featured listing boostPer listing per duration₦3,000–₦10,000Newsletter mentionPer send₦25,000 per broadcast
Phase 2 upgrades to CPM (cost per 1,000 impressions) or CPC (cost per click) model once you have enough traffic data.

PHASE 1 vs PHASE 2 AD SYSTEM
Phase 1 (what you build now — manual):

Admin creates all ads manually in the dashboard
Advertisers contact Tutaly directly to buy ad space
Payment handled offline (bank transfer, then admin activates ad)
Basic impression and click tracking
Simple start/end date management

Phase 2 (self-serve — after launch):

Advertisers create their own account and ad portal
Upload creatives, set budget, choose placements
Pay directly via Flutterwave/Paystack
Real-time analytics dashboard for advertisers
Automated billing and renewal
A/B testing for ad creatives
Audience targeting (by industry, role, location)


WHAT TO TELL YOUR DEVELOPER
For Phase 1 the ads system is relatively simple. Tell your developer:

The ads system for Phase 1 works as follows:
Backend:

Ads table with all fields listed above
GET /ads/active?placement=X — public endpoint, returns currently active ad for a given placement. If multiple active ads exist for the same placement, return a random one (simple rotation)
Increment impression_count each time GET /ads/active is called and returns an ad
POST /ads/:id/click — called when user clicks an ad, increments click_count
Admin endpoints: GET/POST/PATCH/DELETE /admin/ads
Bull cron job: runs daily, sets status → expired for any ad where ends_at < NOW()
Featured jobs: isFeatured boolean on Job entity, featured_until timestamp. Bull cron sets isFeatured → false when featured_until < NOW()

Frontend:

AdBanner component — takes placement prop, fetches active ad, renders image + link + "Sponsored" label. Renders nothing if no active ad
Place AdBanner component in: home page top, jobs page top, shop page top, connect right sidebar, jobs results sidebar
Sponsored jobs: GET /jobs includes isFeatured jobs at top of results before regular jobs
All ads show "Sponsored" label — this is non-negotiable
Never show ads on admin dashboard pages
Never show ads inside the checkout flow


That is the complete advertising system for Tutaly from concept to implementation.You said: i want to build that users can create their own adsi want to build that users can create their own ads8:18 AMClaude responded: Great decision.Great decision. This is a proper self-serve advertising platform — think Google Ads simplified, built specifically for Tutaly. Let me design the complete system from end to end.

TUTALY SELF-SERVE ADVERTISING PLATFORM
Who Can Create Ads
User TypeWhat They Can AdvertiseEmployerTheir company, job listings, employer brandSellerTheir shop listings, services, digital productsAny BusinessExternal website, product, service (pays to reach Tutaly audience)Job SeekerNOT allowed — no advertising needed for seekers

THE COMPLETE AD CREATION FLOW — USER PERSPECTIVE
Step 1 — Access the Ads Portal
Every authenticated user (except seekers) sees an "Advertise" link in their dashboard sidebar and in the top navigation dropdown.
Employer Dashboard sidebar:
  📢 Advertise on Tutaly   ← new nav item

Top nav dropdown (authenticated):
  Profile
  Dashboard
  📢 Create an Ad    ← new item
  Sign Out
Clicking it takes them to:
tutaly.com/advertise
This is a dedicated advertising portal — separate from the main dashboard but still within Tutaly's design system.

Step 2 — Advertise Landing Page
Before the creation flow, show a marketing page that explains the value:
HERO:
"Reach Nigeria's Most Ambitious Professionals"
"Advertise on Tutaly and connect with 50,000+ job seekers,
employers, and professionals actively growing their careers."

THREE VALUE PROPS:
  🎯 Targeted Audience    — professionals by industry, role, location
  📊 Real-time Analytics  — track impressions, clicks, conversions
  💰 Flexible Budgets     — start from as low as ₦2,000

AUDIENCE STATS (social proof):
  50,000+ Monthly Active Users
  120+ Industries Represented
  35 Nigerian States Covered
  Global Reach

AD FORMAT CARDS (4 cards showing each format):
  Banner Ad | Sponsored Job | Sponsored Product | Sidebar Ad
  Each with preview image, description, price range

CTA: "Create Your First Ad →" Blue button

Step 3 — Ad Creation Wizard (5 Steps)
STEP 1 — Choose Your Goal
"What do you want to achieve?"

4 large goal cards:

  🏢 Promote My Business
     "Drive traffic to your website or landing page"
     Best for: External websites, brands, services

  💼 Promote a Job Listing
     "Get more qualified applicants for your open roles"
     Best for: Employers with active job listings
     (Only shows if user has active job listings)

  🛍 Promote a Product or Service
     "Boost visibility of your marketplace listing"
     Best for: Approved sellers with active listings
     (Only shows if user is an approved seller)

  📣 Promote My Company Page
     "Build brand awareness among professionals"
     Best for: Employers wanting to build reputation

Selected card: Blue border + checkmark
Progress bar: Step 1 of 5
STEP 2 — Choose Ad Format
Based on goal selected, show relevant formats:

For "Promote My Business" goal:
  ┌─────────────────────┐  ┌─────────────────────┐
  │   BANNER AD         │  │   SIDEBAR AD         │
  │   [Preview image]   │  │   [Preview image]    │
  │   Full-width banner │  │   300×250 box ad     │
  │   High visibility   │  │   Consistent reach   │
  │   From ₦5,000/day  │  │   From ₦2,000/day   │
  └─────────────────────┘  └─────────────────────┘

For "Promote a Job" goal:
  ┌─────────────────────┐  ┌─────────────────────┐
  │   SPONSORED JOB     │  │   BANNER AD          │
  │   [Job card preview]│  │   [Banner preview]   │
  │   Appears in search │  │   Homepage placement │
  │   From ₦3,000/day  │  │   From ₦5,000/day   │
  └─────────────────────┘  └─────────────────────┘

Each format card shows:
  - Visual preview mockup
  - Where it appears (list of pages)
  - Dimensions
  - Starting price
  - Recommended for what

Hover: shows live preview of where on the platform it appears
STEP 3 — Ad Creative & Content
This step changes based on format selected:

FOR BANNER ADS:
  Upload Zone:
    Drag and drop area with dashed border
    "Upload your banner image"
    Accepted: PNG, JPG, WebP
    Required dimensions shown: 1200×90px (leaderboard) or 728×90px
    Max file size: 2MB
    
    After upload: live preview showing how it looks on the platform
    
  Destination URL:
    "Where should users go when they click?"
    Text input with URL validation
    Preview: shows domain being linked
    
  Alt text: "Describe your ad for accessibility" (required)
  
  Ad Label: Auto-added — users cannot remove the "Sponsored" label

FOR SPONSORED JOB:
  Job Selection:
    "Which job do you want to promote?"
    Dropdown/list of their active approved jobs
    Each shows: Job Title + Location + Posted Date
    
    If no active jobs:
      Warning card: "You don't have any active jobs to promote.
      Post a job first, then come back to boost it."
      "Post a Job →" button
    
  Preview:
    Live preview of how the sponsored job card will look
    With Featured badge, gold border, all job details

FOR SPONSORED PRODUCT:
  Product Selection:
    "Which listing do you want to promote?"
    Grid of their active approved listings with thumbnails
    Click to select
    
  Preview:
    Live product card preview with "Featured" badge

FOR SIDEBAR AD:
  Same as Banner but different dimensions: 300×250px

Creative tips (collapsed accordion below form):
  "💡 Tips for better performing ads"
  - Use high contrast images
  - Include a clear call-to-action
  - Show your product or service clearly
  - Use your brand colours
STEP 4 — Targeting & Schedule
TARGETING SECTION:

  Audience (optional — leaving blank = show to everyone):
  
    By Location:
      Country: dropdown (Nigeria selected by default)
      State: multi-select checkboxes (Lagos, Abuja, Rivers etc.)
      Note: "Leave blank to target all locations"
      
    By Industry:
      Multi-select chips: Technology | Finance | Healthcare | etc.
      "Target users in these industries"
      
    By Role/Seniority:
      Multi-select: Entry Level | Mid Level | Senior | Executive
      
    By User Type:
      Checkboxes: Job Seekers | Employers | Both
      
  Audience size estimator (live):
    As targeting options are selected, show:
    "Estimated weekly reach: 12,400 – 18,000 users"
    This updates in real-time as filters are changed
    Green if audience is large enough, amber if too narrow

PLACEMENT SECTION:
  "Where should your ad appear?"
  
  Checkboxes (multi-select):
    ☑ Home Page — "High traffic, broad audience"
    ☑ Jobs Page — "Job seekers actively browsing"
    ☐ Shop Page — "Professionals shopping for tools"
    ☐ Connect Feed — "Engaged networking audience"
    ☐ Company Reviews — "Research-mode audience"
    ☐ Salary Pages — "High-intent career audience"
    
  Each placement shows estimated daily impressions

SCHEDULE SECTION:
  Start Date: date picker (minimum: tomorrow)
  End Date: date picker (minimum: start date + 1 day)
  
  Duration calculator:
    Auto-calculates: "Your ad will run for 14 days"
    
  Run continuously toggle:
    "Keep running until I pause it manually"
    When on: End Date field hidden

BUDGET SECTION:
  Daily Budget slider:
    Minimum: ₦2,000/day
    Maximum: ₦500,000/day (or enter custom amount)
    Slider with currency formatted labels
    
  OR Total Campaign Budget:
    Toggle between Daily Budget / Total Budget
    If Total: "₦50,000 spread over 14 days = ₦3,571/day"
    
  Price breakdown card (updates live):
    ┌─────────────────────────────────┐
    │  Budget Summary                 │
    │  Daily budget:    ₦5,000       │
    │  Campaign length: 14 days      │
    │  ──────────────────────────────│
    │  Total:          ₦70,000       │
    │                                 │
    │  Est. daily impressions: 2,400 │
    │  Est. daily clicks: 48–96      │
    └─────────────────────────────────┘
    
  Billing note:
    "You will be charged ₦70,000 upfront.
    Unused budget is refunded if you pause before end date."
STEP 5 — Review & Pay
Full ad summary:

  Ad Preview (large):
    Shows exactly how the ad will look on the platform
    Toggle between desktop and mobile preview
    
  Campaign Details:
    Goal:       Promote My Business
    Format:     Banner Ad
    Placement:  Home Page, Jobs Page
    Duration:   Oct 1 – Oct 14, 2026 (14 days)
    Audience:   Lagos, Abuja · Technology, Finance · All user types
    
  Budget Breakdown:
    Daily budget:  ₦5,000
    Total:         ₦70,000
    
  Payment Method:
    [Pay with Flutterwave]  [Pay with Paystack]
    Radio selection between the two
    
  Terms:
    Checkbox: "I agree to Tutaly's Advertiser Policy"
    (Links to /advertiser-policy legal page)
    
  Submit button:
    "Launch Campaign — ₦70,000"
    Blue filled, large, 52px
    
  Under button:
    "Your ad will go live after a quick review (usually within 2 hours)"
    "🔒 Secure payment. Unused budget fully refundable."

Step 4 — Payment Processing
User clicks "Launch Campaign"
→ POST /ads/campaigns/create with all campaign data
→ Order created: status pending_payment
→ Flutterwave or Paystack checkout opens
→ User pays
→ Webhook confirms payment
→ Campaign status → pending_review
→ Admin notified: "New ad campaign awaiting review"
→ User redirected to campaign dashboard with success message
→ Email confirmation sent to user

Step 5 — Admin Review
All user-created ads go through a quick admin review before going live. This prevents inappropriate content.
Admin Ads Queue:
  New campaign notification in admin dashboard
  Admin sees:
    - Ad creative (image preview)
    - Destination URL
    - Advertiser name + account
    - Targeting settings
    - Budget
    
  Admin actions:
    "Approve" → campaign status: active, ad goes live immediately
    "Reject" → campaign status: rejected, advertiser refunded, email sent with reason
    "Request Changes" → pauses campaign, notifies advertiser with feedback
    
  Review time target: within 2 hours (set expectation at submission)
  If not reviewed in 6 hours → auto-escalate notification to admin

Step 6 — Campaign Goes Live
Once approved:
  → Ad status: active
  → Appears in designated placements
  → Impression counting starts
  → Click tracking starts
  → Advertiser gets "Your ad is now live!" email with campaign link

ADVERTISER DASHBOARD
After creating campaigns, users access their full ad management portal:
URL: tutaly.com/advertise/dashboard

Layout: Same dark sidebar + light content

Sidebar nav:
  📊 Overview
  📢 My Campaigns
  ➕ Create Campaign
  💰 Billing
  📈 Analytics
  ⚙️ Ad Settings
Overview Tab
Summary cards (4):
  Total Spent:        ₦245,000    (Gold)
  Total Impressions:  124,500     (Blue)
  Total Clicks:       3,240       (Green)
  Avg CTR:            2.6%        (stat)

Active campaigns table:
  Campaign Name | Status | Budget | Spent | Impressions | Clicks | CTR | End Date | Actions

Performance chart:
  Line chart: Impressions vs Clicks over last 30 days
  Toggle: Daily / Weekly / Monthly
My Campaigns Tab
Filter tabs: All | Active | Pending Review | Paused | Completed | Rejected

Campaign cards (stacked):
  Each card: White, radius 14px, padding 24px

  Left: Ad creative thumbnail (80×80px)
  
  Middle:
    Campaign name (auto-generated or user-named)
    Goal + Format badges
    Placement pills: "Home Page" "Jobs Page"
    Date range: "Oct 1 – Oct 14, 2026"
    
  Right:
    Status badge
    "₦35,000 / ₦70,000 spent" — progress bar below
    Key stats: 62,400 impressions | 1,560 clicks | 2.5% CTR
    
  Footer row:
    [View Analytics] [Edit] [Pause/Resume] [Duplicate] [Delete]

  Rejected campaign:
    Red border, red "Rejected" badge
    "View rejection reason" — expands to show admin feedback
    "Edit and Resubmit" button
Analytics Tab
Campaign selector dropdown (top)

Date range picker

Metrics cards:
  Impressions | Clicks | CTR | Spend | Cost per Click | Reach

Charts:
  Impressions over time (area chart, Blue)
  Clicks over time (area chart, Green)
  
  Placement breakdown (donut chart):
    Home Page: 45%
    Jobs Page: 32%
    Connect Feed: 23%
    
  Audience breakdown (horizontal bars):
    By Industry: Technology 34% | Finance 22% | etc.
    By Location: Lagos 56% | Abuja 28% | etc.
    By Device: Mobile 71% | Desktop 29%
    
  Top performing hours heatmap (7 days × 24 hours grid)

Export button: "Download Report (CSV)"
Billing Tab
Payment history table:
  Date | Campaign | Amount | Payment Method | Status | Receipt

Balance/Credit section:
  If user has unused refunded budget:
  "₦5,000 ad credit available — apply to next campaign"

Refund requests:
  If campaign ended early with unspent budget:
  Auto-refund processed within 3–5 business days
  Refund status shown here

THE COMPLETE BACKEND ARCHITECTURE
New Database Tables
typescript// campaigns table
@Entity('ad_campaigns')
export class AdCampaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  advertiser_id: string; // FK → users.id

  @Column({ type: 'enum', enum: AdGoal })
  goal: AdGoal; // promote_business | promote_job | promote_product | promote_company

  @Column({ type: 'enum', enum: AdFormat })
  format: AdFormat; // banner | sidebar | sponsored_job | sponsored_product

  @Column({ nullable: true })
  job_id: string; // FK → jobs.id (if sponsored job)

  @Column({ nullable: true })
  product_id: string; // FK → shop_products.id (if sponsored product)

  @Column({ nullable: true })
  image_url: string; // S3 path for banner/sidebar creatives

  @Column()
  destination_url: string; // where clicking goes

  @Column({ nullable: true })
  alt_text: string;

  // Targeting
  @Column({ type: 'jsonb', nullable: true })
  target_countries: string[]; // ['Nigeria', 'Ghana']

  @Column({ type: 'jsonb', nullable: true })
  target_states: string[]; // ['Lagos', 'Abuja']

  @Column({ type: 'jsonb', nullable: true })
  target_industries: string[]; // ['Technology', 'Finance']

  @Column({ type: 'jsonb', nullable: true })
  target_roles: string[]; // ['entry', 'mid', 'senior']

  @Column({ type: 'jsonb', nullable: true })
  target_user_types: string[]; // ['seeker', 'employer']

  @Column({ type: 'jsonb' })
  placements: string[]; // ['homepage_top', 'jobs_sidebar']

  // Schedule
  @Column()
  starts_at: Date;

  @Column({ nullable: true })
  ends_at: Date; // null = run continuously

  @Column({ default: false })
  run_continuously: boolean;

  // Budget
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  daily_budget: number; // in NGN

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  total_budget: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total_spent: number;

  // Performance
  @Column({ default: 0 })
  impression_count: number;

  @Column({ default: 0 })
  click_count: number;

  // Status
  @Column({ type: 'enum', enum: CampaignStatus })
  status: CampaignStatus;
  // pending_payment | pending_review | active | paused | completed | rejected | cancelled

  @Column({ nullable: true })
  rejection_reason: string;

  @Column({ nullable: true })
  reviewed_by: string; // FK → admin users.id

  @Column({ nullable: true })
  payment_ref: string; // Flutterwave/Paystack reference

  @Column({ type: 'enum', enum: PaymentGateway })
  payment_gateway: PaymentGateway;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ad_impressions table (for detailed tracking)
@Entity('ad_impressions')
export class AdImpression {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  campaign_id: string; // FK → ad_campaigns.id

  @Column()
  placement: string;

  @Column({ nullable: true })
  user_id: string; // null for guests

  @Column()
  device_type: string; // mobile | desktop | tablet

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  state: string;

  @Column()
  viewed_at: Date;
}

// ad_clicks table
@Entity('ad_clicks')
export class AdClick {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  campaign_id: string;

  @Column()
  placement: string;

  @Column({ nullable: true })
  user_id: string;

  @Column()
  clicked_at: Date;
}
New API Endpoints
ADVERTISER-FACING:
POST   /ads/campaigns                    Create new campaign + initiate payment
GET    /ads/campaigns                    List own campaigns
GET    /ads/campaigns/:id                Single campaign detail
PATCH  /ads/campaigns/:id/pause          Pause active campaign
PATCH  /ads/campaigns/:id/resume         Resume paused campaign
DELETE /ads/campaigns/:id                Cancel campaign (refund if unused budget)
GET    /ads/campaigns/:id/analytics      Campaign performance data
GET    /ads/billing                      Payment history + refunds
GET    /ads/estimate                     Audience size estimator (pre-creation)

TRACKING:
POST   /ads/impression                   Log impression (called by frontend)
POST   /ads/click/:campaignId            Log click + redirect to destination URL

PUBLIC (used by frontend to render ads):
GET    /ads/active?placement=X           Returns active ad for placement
                                         Applies targeting based on current user

ADMIN:
GET    /admin/ads/queue                  Pending review campaigns
PATCH  /admin/ads/:id/approve            Approve campaign → goes live
PATCH  /admin/ads/:id/reject             Reject with reason → refund triggered
GET    /admin/ads/all                    All campaigns with filters
GET    /admin/ads/revenue                Ad revenue summary
Smart Ad Serving Logic
typescript// GET /ads/active?placement=homepage_top
// This is the key logic — serving the right ad to the right user

async getActiveAd(placement: string, currentUser?: User) {
  const now = new Date();
  
  // Get all active campaigns for this placement
  let query = this.campaignRepo
    .createQueryBuilder('c')
    .where('c.status = :status', { status: 'active' })
    .andWhere(':placement = ANY(c.placements)', { placement })
    .andWhere('c.starts_at <= :now', { now })
    .andWhere('(c.ends_at IS NULL OR c.ends_at >= :now)', { now })
    .andWhere('c.total_spent < c.total_budget');

  // Apply targeting filters if user is logged in
  if (currentUser) {
    // Location targeting
    query = query.andWhere(
      '(c.target_states IS NULL OR :state = ANY(c.target_states))',
      { state: currentUser.state }
    );

    // Industry targeting
    query = query.andWhere(
      '(c.target_industries IS NULL OR :industry = ANY(c.target_industries))',
      { industry: currentUser.industry }
    );

    // User type targeting
    query = query.andWhere(
      '(c.target_user_types IS NULL OR :role = ANY(c.target_user_types))',
      { role: currentUser.role }
    );
  }

  const campaigns = await query.getMany();
  
  if (campaigns.length === 0) return null;
  
  // Simple weighted rotation — campaigns with higher budget get more impressions
  const selected = this.weightedRandom(campaigns);
  
  // Check daily budget cap
  const todaySpend = await this.getTodaySpend(selected.id);
  if (todaySpend >= selected.daily_budget) {
    // This campaign hit daily cap — try next one
    return this.getNextEligibleCampaign(campaigns, selected.id);
  }
  
  return selected;
}
Budget Tracking & Daily Cap
typescript// Bull cron job — runs every hour
async checkDailyBudgets() {
  const activeCampaigns = await this.getActiveCampaigns();
  
  for (const campaign of activeCampaigns) {
    // Check if total budget exhausted
    if (campaign.total_spent >= campaign.total_budget) {
      await this.completeCampaign(campaign.id);
      await this.notifyAdvertiser(campaign.advertiser_id, 'budget_exhausted');
    }
    
    // Check if end date passed
    if (campaign.ends_at && campaign.ends_at < new Date()) {
      await this.completeCampaign(campaign.id);
      await this.processRefund(campaign); // refund unspent budget
    }
  }
}

// Refund calculation
async processRefund(campaign: AdCampaign) {
  const unspent = campaign.total_budget - campaign.total_spent;
  if (unspent > 100) { // minimum refund threshold ₦100
    await this.paymentService.processRefund(
      campaign.payment_ref,
      unspent,
      campaign.payment_gateway
    );
    await this.notifyAdvertiser(campaign.advertiser_id, 'refund_processed', unspent);
  }
}

REFUND POLICY FOR ADS
This needs to be clear to users upfront:
ScenarioRefundCampaign rejected by admin100% refund within 24 hoursCampaign cancelled before start date100% refundCampaign paused mid-runUnspent daily budget refundedCampaign ends with unspent budgetAutomatic refund within 3–5 daysCampaign completed normallyNo refund — all budget was usedFraudulent clicks detectedCredit applied to next campaign

WHAT TO TELL YOUR DEVELOPER

Add the self-serve advertising system with the following scope for Phase 1:
New module: ads module in apps/api/src/modules/ads/
New entities: AdCampaign, AdImpression, AdClick — with all fields listed above
New frontend route: apps/web/src/app/(advertise)/ — separate route group for the ad portal
Pages to build:

/advertise — landing page explaining the ad platform
/advertise/create — 5-step campaign creation wizard
/advertise/dashboard — advertiser dashboard with all tabs
/advertise/campaigns/:id — single campaign analytics

Key business rules:

All campaigns go through admin review before going live
Payment is taken upfront for total campaign budget
Unspent budget is automatically refunded on campaign end or rejection
Every ad must display a "Sponsored" label — cannot be removed
Daily budget cap enforced — campaign pauses for the day when daily limit hit, resumes next day
Targeting is optional — no targeting means shown to all users
Seekers cannot create ad campaigns
Ads never appear on checkout pages, inside payment flows, or on admin pages

Also update AGENTS.md to include the ads module in the platform architecture section.
You said: also i want that upon successful  ads creation a user get notified via their mail and in the their respective dashboard something like push notificationalso i want that upon successful  ads creation a user get notified via their mail and in the their respective dashboard something like push notification8:22 AMClaude responded: Perfect.Perfect. Here is the complete notification system for the ads module covering both email and in-app/push notifications for every event in the ad campaign lifecycle.

COMPLETE AD NOTIFICATION SYSTEM

EVERY EVENT THAT TRIGGERS A NOTIFICATION
Map out every moment in the ad journey where the user needs to be informed:
EventEmailIn-AppDashboard AlertCampaign created + payment successful✅✅✅Campaign under admin review✅✅✅Campaign approved and live✅✅✅Campaign rejected✅✅✅Campaign reaches 50% of budget✅✅✅Campaign reaches 80% of budget✅✅✅Campaign budget exhausted✅✅✅Campaign paused by user❌✅✅Campaign resumed by user❌✅✅Campaign ends (end date reached)✅✅✅Refund processed✅✅✅Weekly performance summary✅❌✅Admin requests creative changes✅✅✅

EMAIL NOTIFICATIONS — FULL TEMPLATES
Every email follows the same Tutaly branded template structure:
Email Template Structure:
  Header:    Tutaly logo (full colour) on dark #1A1C1E background
  Body:      White card, clean typography, Plus Jakarta Sans
  CTA:       Blue button linking to relevant dashboard page
  Footer:    "Manage notification preferences" unsubscribe link
             Tutaly address + legal links

EMAIL 1 — Campaign Created & Payment Successful
Subject: "Your Tutaly ad campaign is live for review 🎯"

Header: Tutaly logo on dark background

Body:
  Hi [First Name],

  Your ad campaign has been successfully created and your
  payment of ₦70,000 has been confirmed.

  ─────────────────────────────────
  CAMPAIGN SUMMARY
  ─────────────────────────────────
  Campaign:      Promote My Business
  Format:        Banner Ad
  Placements:    Home Page, Jobs Page
  Duration:      Oct 1 – Oct 14, 2026 (14 days)
  Total Budget:  ₦70,000
  Daily Budget:  ₦5,000
  Payment Ref:   FLW-REF-XXXXXXXXXX
  ─────────────────────────────────

  What happens next?
  Our team will review your ad creative within 2 hours.
  You will receive another email as soon as your campaign
  is approved and goes live.

  [View Campaign Dashboard →]   ← Blue CTA button

  Need help? Reply to this email or visit our Help Center.

  The Tutaly Team

EMAIL 2 — Campaign Under Review
Subject: "We're reviewing your ad — expect approval within 2 hours ⏳"

Body:
  Hi [First Name],

  Great news — your payment was confirmed and your campaign
  is now in our review queue.

  ┌──────────────────────────────────────────┐
  │  📋  Under Review                        │
  │  Campaign: [Campaign Name]               │
  │  Submitted: Oct 1, 2026 at 10:42 AM     │
  │  Expected approval: by 12:42 PM today    │
  └──────────────────────────────────────────┘

  Our team checks every ad to ensure it meets our
  Advertiser Policy. This usually takes less than 2 hours.

  We will email you the moment it is approved and live.

  While you wait, you can:
  → Preview how your ad will look on the platform
  → Review your targeting settings
  → Check your campaign dashboard

  [View Campaign →]

  The Tutaly Team

EMAIL 3 — Campaign Approved & Live
Subject: "🟢 Your ad is LIVE on Tutaly! Here's what to expect"

Body:
  Hi [First Name],

  Your ad campaign has been approved and is now live
  on Tutaly. Users are already seeing it!

  ┌──────────────────────────────────────────┐
  │  ✅  CAMPAIGN LIVE                       │
  │  Campaign: [Campaign Name]               │
  │  Went live: Oct 1, 2026 at 11:58 AM     │
  │  Runs until: Oct 14, 2026               │
  │  Placements: Home Page, Jobs Page        │
  └──────────────────────────────────────────┘

  What to expect:
  📊 Impressions will start appearing in your
     dashboard within the next 30 minutes
  🖱 Clicks will be tracked in real-time
  📈 Your first performance report will be
     ready after 24 hours

  Pro tip: Check your analytics after 48 hours to
  see which placements are performing best.

  [View Live Campaign Analytics →]

  The Tutaly Team

EMAIL 4 — Campaign Rejected
Subject: "Action required: Your Tutaly ad needs attention ⚠️"

Body:
  Hi [First Name],

  We reviewed your ad campaign and unfortunately it
  could not be approved in its current form.

  ┌──────────────────────────────────────────┐
  │  ❌  CAMPAIGN NOT APPROVED               │
  │  Campaign: [Campaign Name]               │
  │  Reviewed: Oct 1, 2026 at 12:15 PM      │
  │  Status: Rejected                        │
  └──────────────────────────────────────────┘

  Reason for rejection:
  "[Admin rejection reason text here]"

  What you can do:
  1. Review our Advertiser Policy
  2. Make the required changes to your creative
  3. Resubmit for review

  Your payment of ₦70,000 has been fully refunded
  and will appear in your original payment method
  within 3–5 business days.

  [Edit and Resubmit →]   [View Advertiser Policy →]

  If you believe this was a mistake, please reply
  to this email with your campaign ID: [CAMPAIGN-ID]

  The Tutaly Team

EMAIL 5 — Budget 50% Used
Subject: "📊 Your campaign has used 50% of its budget"

Body:
  Hi [First Name],

  Your campaign "[Campaign Name]" is performing well
  and has reached the halfway point of its budget.

  ─────────────────────────────────
  BUDGET STATUS
  ─────────────────────────────────
  Total Budget:     ₦70,000
  Amount Spent:     ₦35,000  (50%)
  Remaining:        ₦35,000
  Days Remaining:   7 of 14
  ─────────────────────────────────

  Performance so far:
  👁  Impressions:   34,200
  🖱  Clicks:        856
  📊  CTR:           2.5%
  💰  Cost per Click: ₦40.89

  Your campaign is on track. No action needed.

  Want to extend your reach?
  [Increase Budget →]   [View Full Analytics →]

  The Tutaly Team

EMAIL 6 — Budget 80% Used
Subject: "⚠️ Your ad campaign budget is running low"

Body:
  Hi [First Name],

  Your campaign "[Campaign Name]" has used 80% of
  its budget. Consider topping up to keep it running.

  ─────────────────────────────────
  BUDGET STATUS
  ─────────────────────────────────
  Total Budget:     ₦70,000
  Amount Spent:     ₦56,000  (80%)
  Remaining:        ₦14,000
  Estimated days left at current pace: 2.8 days
  ─────────────────────────────────

  Your campaign ends Oct 14. At the current spend
  rate, your budget may run out before the end date.

  Options:
  → Add more budget to keep running until Oct 14
  → Let it run until budget is exhausted
  → Pause the campaign to save remaining budget

  [Add Budget →]   [View Campaign →]   [Pause →]

  The Tutaly Team

EMAIL 7 — Budget Exhausted
Subject: "Your Tutaly campaign has ended — here's your final report 📈"

Body:
  Hi [First Name],

  Your campaign "[Campaign Name]" has ended because
  the total budget has been fully used.

  ─────────────────────────────────────────
  FINAL CAMPAIGN REPORT
  Oct 1 – Oct 10, 2026 (10 days)
  ─────────────────────────────────────────
  Total Spent:        ₦70,000
  Total Impressions:  62,400
  Total Clicks:       1,560
  Average CTR:        2.5%
  Cost per Click:     ₦44.87
  Best Placement:     Jobs Page (67% of clicks)
  Peak Day:           Oct 5 (5,400 impressions)
  ─────────────────────────────────────────

  Your campaign performed above the platform
  average CTR of 1.8%. 🎉

  Ready to run another campaign?
  Your audience is waiting.

  [Create New Campaign →]   [Download Full Report →]

  The Tutaly Team

EMAIL 8 — Campaign Ended (End Date Reached)
Subject: "Your campaign has completed — final results inside 🏁"

Body:
  Hi [First Name],

  Your campaign "[Campaign Name]" ran its full
  scheduled duration and has now ended.

  [Same performance summary as Email 7]

  Unspent Budget Refund:
  ┌─────────────────────────────────┐
  │  Budget:       ₦70,000         │
  │  Spent:        ₦62,400         │
  │  Refund:       ₦7,600          │
  │  Refund ETA:   3–5 business    │
  │                days             │
  └─────────────────────────────────┘

  [Create New Campaign →]   [View Full Report →]

  The Tutaly Team

EMAIL 9 — Refund Processed
Subject: "💰 Your Tutaly ad refund of ₦7,600 is on its way"

Body:
  Hi [First Name],

  Your refund has been processed successfully.

  ┌──────────────────────────────────────────┐
  │  ✅  REFUND PROCESSED                    │
  │  Amount:   ₦7,600                        │
  │  Reason:   Unspent campaign budget       │
  │  Method:   Original payment method       │
  │  Ref:      REF-XXXXXXXXXX                │
  │  ETA:      3–5 business days             │
  └──────────────────────────────────────────┘

  The refund will appear in your original
  payment account within 3–5 business days.

  Questions about your refund?
  Reply to this email with your reference number.

  The Tutaly Team

EMAIL 10 — Weekly Performance Summary
Subject: "📊 Your weekly ad report — [Campaign Name]"

Sent: Every Monday morning for active campaigns

Body:
  Hi [First Name],

  Here is your weekly performance summary for
  "[Campaign Name]" — Week of Sept 29 – Oct 5.

  ─────────────────────────────────────────
  THIS WEEK
  ─────────────────────────────────────────
  Impressions:    18,400   (+12% vs last week)
  Clicks:         460      (+8% vs last week)
  CTR:            2.5%     (Platform avg: 1.8%)
  Spent:          ₦24,500
  Remaining:      ₦45,500
  ─────────────────────────────────────────

  Top performing day: Thursday Oct 3
  Best placement: Jobs Page

  Performance vs benchmark:
  Your CTR is 39% above platform average 🚀

  [View Full Dashboard →]

  The Tutaly Team

IN-APP NOTIFICATIONS — COMPLETE SYSTEM
In-app notifications appear in two places simultaneously:
1. The notification bell in the top navigation bar
2. The notifications panel in the advertiser dashboard sidebar

Notification Bell Behaviour
Location: Top navigation bar, right side
Icon: Bell icon (Lucide Bell)
Badge: Red circle with number when unread notifications exist
       Disappears when all read

On click: Dropdown panel slides down (320px wide)
  Shows last 10 notifications
  Each notification:
    - Coloured icon on left (matches notification type)
    - Title + short description
    - Time ago
    - Unread: slightly blue-tinted background
    - Read: white background
  
  Bottom: "View all notifications →" link
          "Mark all as read" button

Notification Types & Visual Design
Each notification has:
  Icon:         Coloured circle with white icon inside
  Title:        Bold, 14px, dark
  Description:  Regular, 13px, muted
  Time:         Relative (2 mins ago, 1 hour ago, 2 days ago)
  Link:         Clicking navigates to relevant page
  Dot:          Blue dot on left if unread

Notification type → icon colour mapping:

  Campaign created:      Blue circle    📢 icon
  Under review:          Gold circle    🔍 icon
  Campaign approved:     Green circle   ✅ icon
  Campaign rejected:     Red circle     ❌ icon
  Budget 50%:            Gold circle    📊 icon
  Budget 80%:            Orange circle  ⚠️ icon
  Budget exhausted:      Red circle     🔴 icon
  Campaign paused:       Gray circle    ⏸ icon
  Campaign resumed:      Blue circle    ▶️ icon
  Campaign ended:        Green circle   🏁 icon
  Refund processed:      Green circle   💰 icon
  Admin changes request: Gold circle    ✏️ icon
  Weekly report ready:   Blue circle    📈 icon

In-App Notification Messages
1. CAMPAIGN CREATED:
   Title:    "Campaign created successfully"
   Body:     "Your ₦70,000 campaign is now under review"
   Link:     /advertise/campaigns/:id
   
2. UNDER REVIEW:
   Title:    "Ad under review"
   Body:     "We're reviewing your ad — usually takes under 2 hours"
   Link:     /advertise/campaigns/:id

3. CAMPAIGN APPROVED:
   Title:    "🟢 Your ad is now live!"
   Body:     "[Campaign Name] is running on Home Page, Jobs Page"
   Link:     /advertise/campaigns/:id/analytics

4. CAMPAIGN REJECTED:
   Title:    "Action required: Ad not approved"
   Body:     "Your campaign needs changes before it can run"
   Link:     /advertise/campaigns/:id (shows rejection reason)

5. BUDGET 50%:
   Title:    "Campaign halfway through budget"
   Body:     "[Campaign Name] has used ₦35,000 of ₦70,000"
   Link:     /advertise/campaigns/:id

6. BUDGET 80%:
   Title:    "⚠️ Budget running low"
   Body:     "[Campaign Name] has only ₦14,000 remaining"
   Link:     /advertise/campaigns/:id (shows top-up option)

7. BUDGET EXHAUSTED:
   Title:    "Campaign ended — budget fully used"
   Body:     "View your final campaign results"
   Link:     /advertise/campaigns/:id/analytics

8. CAMPAIGN PAUSED:
   Title:    "Campaign paused"
   Body:     "[Campaign Name] has been paused successfully"
   Link:     /advertise/campaigns/:id

9. CAMPAIGN RESUMED:
   Title:    "Campaign resumed"
   Body:     "[Campaign Name] is live again"
   Link:     /advertise/campaigns/:id

10. CAMPAIGN ENDED:
    Title:   "Campaign completed 🏁"
    Body:    "[Campaign Name] ran its full duration. View results."
    Link:    /advertise/campaigns/:id/analytics

11. REFUND PROCESSED:
    Title:   "💰 Refund of ₦7,600 processed"
    Body:    "Your unused budget refund is on its way — 3–5 days"
    Link:    /advertise/billing

12. CHANGES REQUESTED:
    Title:   "Admin requested changes to your ad"
    Body:    "Please update your creative and resubmit"
    Link:    /advertise/campaigns/:id (shows admin feedback)

13. WEEKLY REPORT:
    Title:   "📊 Your weekly report is ready"
    Body:    "[Campaign Name]: 18,400 impressions this week"
    Link:    /advertise/campaigns/:id/analytics

Dashboard Alert Panel
Inside the advertiser dashboard, a dedicated alerts section shows important actions needed:
Location: Top of advertiser dashboard overview tab
          Below the welcome header, above the stats cards

Only shows when there are actionable items:

Alert types:

  REJECTION ALERT (Red):
  ┌─────────────────────────────────────────────────────┐
  │ ❌  Action Required                                  │
  │ "[Campaign Name]" was not approved.                  │
  │ Reason: "Image contains prohibited content"          │
  │ [Edit Campaign →]                        [Dismiss]  │
  └─────────────────────────────────────────────────────┘

  LOW BUDGET ALERT (Amber):
  ┌─────────────────────────────────────────────────────┐
  │ ⚠️  Budget Running Low                              │
  │ "[Campaign Name]" has ₦14,000 left (2.8 days)       │
  │ [Add Budget →]                           [Dismiss]  │
  └─────────────────────────────────────────────────────┘

  CAMPAIGN LIVE ALERT (Green — auto-dismisses after 24hrs):
  ┌─────────────────────────────────────────────────────┐
  │ ✅  Your Campaign is Live!                          │
  │ "[Campaign Name]" is now showing to users.          │
  │ [View Analytics →]                       [Dismiss]  │
  └─────────────────────────────────────────────────────┘

  CHANGES NEEDED (Gold):
  ┌─────────────────────────────────────────────────────┐
  │ ✏️  Admin Requested Changes                         │
  │ "[Campaign Name]" needs updates before it can run.  │
  │ [View Feedback →]                        [Dismiss]  │
  └─────────────────────────────────────────────────────┘

Multiple alerts stack vertically
Each has a dismiss × button
Dismissed alerts don't reappear

BACKEND IMPLEMENTATION
Notification Service Updates
typescript// In NotificationService — add ad-specific methods

async notifyAdCampaignCreated(
  userId: string,
  campaign: AdCampaign
) {
  // 1. Create in-app notification
  await this.createNotification({
    userId,
    type: 'ad_campaign_created',
    title: 'Campaign created successfully',
    message: `Your ₦${campaign.total_budget.toLocaleString()} campaign is now under review`,
    link: `/advertise/campaigns/${campaign.id}`,
    icon: 'megaphone',
    iconColor: 'blue'
  });

  // 2. Send email via SendGrid
  await this.emailService.send({
    to: userId,
    templateId: 'AD_CAMPAIGN_CREATED',
    data: {
      campaignId: campaign.id,
      goal: campaign.goal,
      format: campaign.format,
      placements: campaign.placements,
      startDate: campaign.starts_at,
      endDate: campaign.ends_at,
      totalBudget: campaign.total_budget,
      dailyBudget: campaign.daily_budget,
      paymentRef: campaign.payment_ref
    }
  });
}

async notifyAdCampaignApproved(
  userId: string,
  campaign: AdCampaign
) {
  await this.createNotification({
    userId,
    type: 'ad_campaign_approved',
    title: '🟢 Your ad is now live!',
    message: `${campaign.name} is running on ${campaign.placements.join(', ')}`,
    link: `/advertise/campaigns/${campaign.id}/analytics`,
    icon: 'check-circle',
    iconColor: 'green',
    priority: 'high' // shows as dashboard alert too
  });

  await this.emailService.send({
    to: userId,
    templateId: 'AD_CAMPAIGN_APPROVED',
    data: { campaign }
  });
}

async notifyAdCampaignRejected(
  userId: string,
  campaign: AdCampaign,
  reason: string
) {
  await this.createNotification({
    userId,
    type: 'ad_campaign_rejected',
    title: 'Action required: Ad not approved',
    message: 'Your campaign needs changes before it can run',
    link: `/advertise/campaigns/${campaign.id}`,
    icon: 'x-circle',
    iconColor: 'red',
    priority: 'high',
    actionRequired: true // triggers dashboard alert banner
  });

  await this.emailService.send({
    to: userId,
    templateId: 'AD_CAMPAIGN_REJECTED',
    data: { campaign, reason }
  });
}

async notifyBudgetThreshold(
  userId: string,
  campaign: AdCampaign,
  threshold: 50 | 80
) {
  const remaining = campaign.total_budget - campaign.total_spent;
  
  await this.createNotification({
    userId,
    type: threshold === 80 ? 'ad_budget_low' : 'ad_budget_halfway',
    title: threshold === 80
      ? '⚠️ Budget running low'
      : 'Campaign halfway through budget',
    message: `${campaign.name} has ₦${remaining.toLocaleString()} remaining`,
    link: `/advertise/campaigns/${campaign.id}`,
    icon: threshold === 80 ? 'alert-triangle' : 'bar-chart',
    iconColor: threshold === 80 ? 'orange' : 'gold',
    priority: threshold === 80 ? 'high' : 'normal'
  });

  await this.emailService.send({
    to: userId,
    templateId: threshold === 80
      ? 'AD_BUDGET_LOW'
      : 'AD_BUDGET_HALFWAY',
    data: { campaign, remaining, threshold }
  });
}
Bull Queue Jobs for Scheduled Notifications
typescript// Bull queue processors for scheduled ad notifications

// Job 1: Budget threshold checker — runs every hour
@Process('check-ad-budgets')
async checkAdBudgets() {
  const activeCampaigns = await this.campaignService.getActiveCampaigns();
  
  for (const campaign of activeCampaigns) {
    const spentPercent = (campaign.total_spent / campaign.total_budget) * 100;
    
    // Check 50% threshold
    if (spentPercent >= 50 && !campaign.notified_50) {
      await this.notificationService.notifyBudgetThreshold(
        campaign.advertiser_id, campaign, 50
      );
      await this.campaignService.markNotified(campaign.id, '50');
    }
    
    // Check 80% threshold
    if (spentPercent >= 80 && !campaign.notified_80) {
      await this.notificationService.notifyBudgetThreshold(
        campaign.advertiser_id, campaign, 80
      );
      await this.campaignService.markNotified(campaign.id, '80');
    }
    
    // Check budget exhausted
    if (campaign.total_spent >= campaign.total_budget) {
      await this.campaignService.completeCampaign(campaign.id);
      await this.notificationService.notifyBudgetExhausted(
        campaign.advertiser_id, campaign
      );
    }
    
    // Check end date passed
    if (campaign.ends_at && campaign.ends_at < new Date()) {
      await this.campaignService.completeCampaign(campaign.id);
      await this.notificationService.notifyCampaignEnded(
        campaign.advertiser_id, campaign
      );
      await this.campaignService.processRefund(campaign);
    }
  }
}

// Job 2: Weekly performance summary — runs every Monday 8am
@Process('weekly-ad-report')
async sendWeeklyReports() {
  const activeCampaigns = await this.campaignService
    .getCampaignsRunningForAtLeast7Days();
  
  for (const campaign of activeCampaigns) {
    const weeklyStats = await this.analyticsService
      .getWeeklyStats(campaign.id);
    
    await this.notificationService.notifyWeeklyReport(
      campaign.advertiser_id,
      campaign,
      weeklyStats
    );
  }
}

NOTIFICATION SETTINGS FOR ADVERTISERS
Users can control which notifications they receive. Add these to their notification settings page:
ADVERTISING NOTIFICATIONS:

  ☑  Campaign status updates (approved, rejected, live)
     "Always recommended — never miss important updates"

  ☑  Budget alerts (50% and 80% thresholds)
     "Get notified before your budget runs out"

  ☑  Campaign completion and refunds
     "Know when your campaign ends and refunds are processed"

  ☑  Weekly performance reports
     "Receive your campaign summary every Monday"

  ☑  Admin messages and change requests
     "Required for campaign management"
All are enabled by default. Users can toggle off optional ones (weekly reports, budget alerts) but campaign status and admin messages remain mandatory and cannot be turned off.

WHAT TO TELL YOUR DEVELOPER

Add the following to the ads module and notification service:
Notification triggers — wire these up in ads.service.ts:

On successful payment webhook → notifyAdCampaignCreated()
On admin approval → notifyAdCampaignApproved()
On admin rejection → notifyAdCampaignRejected() + trigger refund
On admin change request → notifyAdChangesRequested()
On campaign completion → notifyCampaignEnded() + process refund

Bull queue jobs — add to the jobs processor:

check-ad-budgets: runs every hour — checks 50% and 80% spend thresholds, budget exhaustion, end date expiry
weekly-ad-report: runs every Monday at 8am — sends performance summary for all active campaigns running 7+ days

SendGrid templates — create 10 email templates:

AD_CAMPAIGN_CREATED, AD_UNDER_REVIEW, AD_APPROVED, AD_REJECTED, AD_BUDGET_50, AD_BUDGET_80, AD_BUDGET_EXHAUSTED, AD_CAMPAIGN_ENDED, AD_REFUND_PROCESSED, AD_WEEKLY_REPORT

New fields on AdCampaign entity:

notified_50: boolean default false
notified_80: boolean default false
notified_complete: boolean default false

Notification settings — add advertising category to PATCH /users/settings/notifications
Dashboard alerts — add GET /ads/campaigns/alerts endpoint returning active actionable alerts for the advertiser dashboard banner
Generate migration for all new fields
You said: concerning the ads# Tutaly Self-Serve Advertising Platform

Implement a comprehensive self-serve advertising system that allows employers, sellers, and businesses to create, manage, and track ad campaigns. This includes a new backend module, database tables, billing logic, and a frontend advertiser portal.

## Uspastedconcerning the ads8:27 AMClaude responded: This is a solid and well-structured implementation plan.This is a solid and well-structured implementation plan. Your developer clearly understood the brief. Here is your complete review:

Overall verdict: Approve with answers to their 3 open questions and a few additions.

Answer Their 3 Open Questions
Question 1 — S3/Supabase upload for banner images:

Yes, use the existing Supabase Storage upload pattern already established in the codebase. Create a dedicated bucket called ad-creatives (private). Use the same signed URL pattern used for CV uploads and product files. The upload endpoint should be POST /ads/campaigns/upload-creative — returns a signed URL after validating file type (PNG, JPG, WebP only) and size (max 2MB). Never expose the raw S3/Supabase key in any API response.

Question 2 — @nestjs/schedule vs Bull queue:

Use Bull queue — it is already set up in the codebase. Do not add @nestjs/schedule as a new dependency. Consistency matters — everything async in this project goes through Bull. Add two new Bull jobs:

check-ad-budgets — runs every hour via Bull's repeat option
weekly-ad-report — runs every Monday at 8am via Bull cron syntax

This keeps all background jobs in one place and makes them visible in any Bull monitoring dashboard you add later.

Question 3 — Email templates:

Do not add placeholders. Build all 10 SendGrid templates properly from the start. The templates are:
AD_CAMPAIGN_CREATED, AD_UNDER_REVIEW, AD_APPROVED, AD_REJECTED, AD_BUDGET_50, AD_BUDGET_80, AD_BUDGET_EXHAUSTED, AD_CAMPAIGN_ENDED, AD_REFUND_PROCESSED, AD_WEEKLY_REPORT.
Each template uses the standard Tutaly email layout — dark header with logo, white body card, blue CTA button, unsubscribe footer. Wire them all up now. Skipping this means coming back to it later which always takes longer.


What Is Correct in the Plan — Approve These

AdCampaign, AdImpression, AdClick entities ✅
Three separate controllers (advertiser, tracking, admin) ✅
Weighted rotation + daily cap logic in ads.service.ts ✅
Separate ads-cron.service.ts for background jobs ✅
Five-step creation wizard frontend ✅
Separate (advertise) route group with its own layout ✅
AGENTS.md update ✅
Payment via existing Flutterwave webhook pattern ✅
TypeORM relations to users, jobs, shop_products ✅


What Is Missing — Add These
1. Notification triggers are not mentioned
The plan covers the campaign mechanics but does not mention the notification system. Tell your developer:

After every campaign status change, call NotificationService with the correct notification type. Wire up all 13 notification events listed in the notification spec. Both in-app notification record creation AND SendGrid email must fire on every trigger. Do not leave notification calls as TODOs.

2. notified_50 and notified_80 flags missing from entity
The cron job needs to know if it already sent a budget threshold notification to avoid sending it repeatedly every hour. Add these fields to AdCampaign entity:
typescript@Column({ default: false })
notified_50: boolean;

@Column({ default: false })
notified_80: boolean;

@Column({ default: false })
notified_complete: boolean;
Tell your developer to include these in the entity and migration.
3. Dashboard alert endpoint not mentioned
The advertiser dashboard needs a dedicated endpoint to fetch actionable alerts — rejected campaigns, low budget warnings, change requests. Add:
GET /ads/campaigns/alerts
Returns array of active alerts for the current user. Frontend renders these as coloured banner alerts at the top of the advertiser dashboard overview tab.
4. Notification settings integration missing
The plan does not mention updating the user notification settings. Tell your developer:

Add an advertising notifications category to the existing PATCH /users/settings/notifications endpoint. Five toggles: campaign status updates, budget alerts, weekly reports, refund notifications, admin messages. All default to true. Campaign status and admin messages cannot be disabled.

5. Seekers must be blocked from the advertise portal
The plan mentions "non-seeker authenticated users" in the nav update but does not specify where this guard lives. Tell your developer:

Add a middleware guard on the entire (advertise) route group that checks user role. If role === seeker redirect to /dashboard/seeker with a toast message "Advertising is available for employers and businesses." This must be enforced at the Next.js middleware level — not just hidden in the UI.

6. Migration not explicitly mentioned
The plan mentions running migration generation for verification but does not explicitly say to commit the migration. Tell your developer:

After generating the migration for AdCampaign, AdImpression, and AdClick entities — review it carefully, run it against Supabase, and commit both the entity files and the migration file together in the same commit. Follow the mandatory 5-step schema change workflow in AGENTS.md.


One Important Business Rule to Confirm
The plan assumes payment is taken upfront for the total campaign budget. Confirm this is correct by telling your developer:

Payment model confirmed: full total campaign budget charged upfront at campaign creation. Unspent budget is automatically refunded when campaign ends or is rejected. The order record stores total_budget as amount_paid. Commission on ad revenue goes entirely to Tutaly — no seller split. The 20% commission logic used in shop orders does NOT apply to ad campaigns. Ad revenue = 100% platform revenue.


Updated AGENTS.md Addition
Tell your developer exactly what to add to AGENTS.md:
ADS MODULE:
Location: apps/api/src/modules/ads/
Frontend: apps/web/src/app/(advertise)/

Business rules:
- Seekers cannot create ad campaigns — blocked at middleware level
- All campaigns require admin review before going live
- Full budget charged upfront — unspent balance auto-refunded
- Ad revenue is 100% platform revenue — no commission split
- Every ad must display "Sponsored" label — never removable
- Ads never appear on checkout, payment flows, or admin pages
- Budget threshold notifications at 50% and 80% spend
- Daily budget cap enforced hourly by Bull cron job
- Weekly performance summary sent every Monday 8am via Bull
- Upload bucket: ad-creatives (Supabase Storage, private)
- notified_50 + notified_80 + notified_complete flags prevent duplicate alerts

Verification Plan Addition
The plan's verification steps are good but add these:

After manual verification, also test:

Attempt to access /advertise as a seeker — confirm redirect
Trigger the budget cron manually and confirm notifications fire
Confirm "Sponsored" label appears on all rendered ads
Confirm ad does not appear on /shop/checkout or any payment page
Run pnpm -r run lint — confirm zero new errors introduced
Generate and review migration file before running it



Final instruction to send to your developer:

Approved with the following additions:

Use Bull queue not @nestjs/schedule — already set up in codebase
Use existing Supabase Storage pattern — new bucket: ad-creatives
Build all 10 SendGrid email templates now — no placeholders
Add notified_50, notified_80, notified_complete to AdCampaign entity
Add GET /ads/campaigns/alerts endpoint for dashboard alert banners
Wire all 13 notification triggers in NotificationService
Add advertising category to notification settings
Block seekers at Next.js middleware level on the (advertise) route group
Commit entity + migration file together in same commit
Ad revenue is 100% platform revenue — do not apply the 20% shop commission logic
Update AGENTS.md with ads module rules as specified above

Proceed with implementation.
You said: are you sure job seekers shouldn't see ads?are you sure job seekers shouldn't see ads?8:29 AMClaude responded: You are right to question that.You are right to question that. I was wrong. Let me correct this.
Job seekers absolutely should see ads. They are actually the most valuable audience on the platform for advertisers.

Why Seekers Should See Ads
Seeker BehaviourWhy Advertisers Want to Reach ThemActively browsing jobsPerfect audience for recruitment agencies, training companies, CV writing servicesReading company reviewsCompanies want to advertise their employer brand to people researching themChecking salary dataFinancial services, banks, investment apps want this audienceShopping in the marketplaceSellers want to promote their products to active usersUsing the Connect feedAny brand wanting professional audience exposureHigh intent usersThey are actively doing something career-related — highest engagement
Nigerian job seekers are the core of Tutaly's traffic. Advertisers will specifically pay to reach them.

What Needs to Change
The only restriction should be:
Seekers cannot CREATE ads — but they absolutely see ads as they use the platform.
Correct rule:
  Seeing ads:     ALL users including seekers, employers, guests
  Creating ads:   Employers, sellers, and external businesses ONLY
                  Seekers CANNOT create ad campaigns

Update for Your Developer
Tell your developer to correct this in two places:
1. Ad serving logic — remove seeker exclusion:
typescript// GET /ads/active?placement=X
// Serve ads to ALL users including seekers and guests
// No role restriction on viewing ads
async getActiveAd(placement: string, currentUser?: User) {
  // Target by role if advertiser chose targeting
  // But never BLOCK a role from seeing ads
}
2. Ad creation guard — seekers blocked from creating only:
typescript// (advertise) route group middleware
// Block seekers from CREATING ads
// But the /ads/active public endpoint stays open to everyone

if (user.role === 'seeker') {
  // Block access to /advertise/create
  // Block access to /advertise/dashboard
  // Block access to POST /ads/campaigns
  // DO NOT block seeing ads on public pages
}
3. Advertiser targeting options — add seeker targeting:
When an employer creates an ad campaign, they should be able to TARGET seekers specifically:
Audience targeting options:
  ☑ Job Seekers      ← most valuable for most advertisers
  ☑ Employers
  ☑ Sellers
  ☑ All Users
Most advertisers will want to reach seekers. A training company, a CV writing service, a bank offering personal loans — they all specifically want the seeker audience.

Also Update AGENTS.md
Change this rule from:
Seekers cannot create ad campaigns — blocked at middleware level
To:
Seekers CANNOT create ad campaigns — blocked at (advertise) 
route middleware and POST /ads/campaigns endpoint.

Seekers CAN see ads — all authenticated users and guests see 
ads on public pages, jobs page, shop, connect feed, and all 
other ad placements. Never restrict ad visibility by role.

Good catch. Seekers seeing ads is actually the entire business model — advertisers pay specifically to reach them.You said: wat do u think about this?# Complete Ads Module Implementation Plan

This document outlines the tasks required to finalize the implementation of the Ads Module according to the approved review and business rules.

## Proposed Changes

### 1. Database & Entities
#### [MODIFY] [ad-campaign.entity.ts](file:///c:/Users/jepastedwat do u think about this?11:38 PMClaude responded: This is excellent.This is excellent. Your developer has incorporated every single correction and addition from the review. Here is the full assessment:

Verdict: Approve and proceed immediately.

What Was Correctly Addressed
Every point from the review is in this plan:
Review PointPlan ResponseUse Bull not @nestjs/schedule✅ Explicitly statedUse Supabase Storage ad-creatives bucket✅ Included with correct validationBuild all 10 email templates properly✅ All 10 listed with correct layout specAdd notified_50, notified_80, notified_complete✅ Exact TypeScript shownMigration committed with entity✅ Explicitly statedGET /ads/campaigns/alerts endpoint✅ IncludedWire all 13 notification triggers✅ IncludedAdd advertising notification settings category✅ With correct enforcement rulesSeekers blocked from creating — middleware level✅ Correct approachSeekers CAN see ads — corrected✅ Explicitly fixedSeeker targeting option added✅ All 4 user types listed100% platform revenue — no 20% commission✅ Explicitly statedAGENTS.md update✅ Included

Three Small Things to Confirm Before They Start
1. The notification enforcement rule:
The plan says campaign status and admin messages cannot be disabled. Make sure your developer implements this as a server-side enforcement, not just a disabled toggle on the frontend:

When PATCH /users/settings/notifications is called, if the payload attempts to set campaign_status_notifications or admin_message_notifications to false — silently ignore those values and keep them as true. Never trust the frontend to enforce this.

2. The Supabase signed URL for ad creatives:
The plan says return a signed URL without exposing the raw key. Confirm the signed URL expiry for ad creatives should be longer than the 1-hour expiry used for CV and product file downloads. Ad banners need to be served continuously while a campaign is active — potentially for 30 days. Tell your developer:

Ad creative signed URLs should have a 7-day expiry and be regenerated automatically by the ad serving logic when they are within 24 hours of expiry. Add a regenerate_url_at timestamp field to AdCampaign so the cron job knows when to refresh it. Alternatively use Supabase Storage public URLs for ad creatives since they are images intended for public display — not sensitive files like CVs or product downloads. Public URLs are simpler and more appropriate for banner images.

3. The weekly report Bull job timing:
The plan says Monday 8am but does not specify timezone. Nigeria is WAT (West Africa Time) which is UTC+1. Tell your developer:

Weekly report cron runs Monday 8am WAT (UTC+1). In Bull cron syntax this is 0 7 * * 1 (7am UTC = 8am WAT). All time-based cron jobs on this platform should use UTC internally and display in WAT for Nigerian users.


Verification Plan Is Strong
The 5 manual verification steps cover the critical paths. Add one more:

Also verify: create a campaign as an employer, complete payment, confirm notification bell shows the in-app notification, confirm email arrives at the registered email address, then log in as admin and approve the campaign — confirm the advertiser receives both the approval in-app notification and the approval email within 2 minutes.

This tests the complete end-to-end notification chain in one flow.

Final Message to Send to Developer

Plan approved. Proceed with implementation. Three additions before you start:

Use public Supabase Storage URLs for ad creative images — not signed URLs with short expiry. Ad banners are public images, not sensitive files. Update the upload endpoint to store in a public bucket called ad-creatives-public.
Enforce campaign_status and admin_message notification settings server-side — silently ignore any attempt to set them to false in PATCH /users/settings/notifications.
Weekly report cron uses 0 7 * * 1 in UTC (= 8am WAT Nigeria time). All cron jobs use UTC internally.

Run pnpm -r run lint after each major addition — do not accumulate lint errors. Commit entity + migration together. Update task.md as you complete each of the 9 sections.
You said: how do i migrate from supabase to neon for db?how do i migrate from supabase to neon for db?11:41 PMClaude responded: Good move.Good move. Neon is actually a better choice than Supabase for a production NestJS app. Here is why and exactly how to do it.

WHY NEON OVER SUPABASE FOR TUTALY
FeatureSupabaseNeonDatabase typePostgreSQLPostgreSQLPricingFree tier pauses after 1 week inactivityFree tier never pausesBranchingNoYes — create DB branches like Git branchesServerless scalingLimitedBuilt for serverless, scales to zeroConnection poolingBasicBuilt-in PgBouncer poolingDirect PostgreSQLYesYes — standard connection stringCold startsSlow on free tierFastProduction readinessGoodExcellentTypeORM compatibilityFullFull — same PostgreSQL driver
The migration is clean because both are standard PostgreSQL. Your code does not change at all — only the connection string changes.

COMPLETE MIGRATION GUIDE — STEP BY STEP

STEP 1 — Create Your Neon Account and Project
1. Go to neon.tech
2. Sign up with GitHub (recommended)
3. Click "Create Project"
4. Fill in:
   Project name:  tutaly
   Database name: tutaly_db
   Region:        AWS us-east-1 (same as your current Upstash Redis)
                  — keeping same region reduces latency
5. Click "Create Project"
6. Neon creates your database instantly
After creation Neon shows you a connection string. Copy it — it looks like this:
postgresql://tutaly_owner:XXXXXXXX@ep-XXXXX.us-east-1.aws.neon.tech/tutaly_db?sslmode=require

STEP 2 — Export Your Data from Supabase
On your local machine or development machine run:
bash# Get your Supabase connection string from:
# Supabase Dashboard → Project Settings → Database → Connection String → URI

# Export everything from Supabase
pg_dump \
  --no-owner \
  --no-acl \
  --format=plain \
  --file=tutaly_backup.sql \
  "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
If you do not have pg_dump installed:
bash# Windows (if you have PostgreSQL installed)
# It is in C:\Program Files\PostgreSQL\16\bin\pg_dump.exe

# Or install it via:
# https://www.postgresql.org/download/windows/
The output file tutaly_backup.sql contains all your tables, data, indexes, and constraints.

STEP 3 — Clean the Export File
Supabase adds some extensions and schemas that Neon does not need. Before importing, clean the file:
bash# Open tutaly_backup.sql in VS Code

# Remove or comment out these lines if they exist:
# CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  ← Neon has this already
# CREATE SCHEMA IF NOT EXISTS auth;             ← Supabase-specific
# CREATE SCHEMA IF NOT EXISTS storage;          ← Supabase-specific
# SET search_path TO auth, public;              ← Change to: SET search_path TO public;

# Also remove any lines starting with:
# ALTER ROLE
# GRANT ... TO supabase_admin
# GRANT ... TO authenticator
If your database is mostly empty (still in development with test data only) you can skip the export entirely and just run your existing migrations against Neon fresh. This is actually cleaner.

STEP 4 — Import to Neon
Option A — If you are importing existing data:
bash# Import the cleaned SQL file into Neon
psql \
  "postgresql://tutaly_owner:XXXXXXXX@ep-XXXXX.us-east-1.aws.neon.tech/tutaly_db?sslmode=require" \
  --file=tutaly_backup.sql
Option B — If starting fresh (recommended for development stage):
bash# Just run your TypeORM migrations against Neon
# First update your .env (Step 5), then:

cd apps/api
pnpm migration:run
This recreates all tables from your migration history which is the cleanest approach.

STEP 5 — Update Environment Variables
This is the only code change needed:
bash# In your .env file — change DATABASE_URL:

# OLD (Supabase):
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres

# NEW (Neon):
DATABASE_URL=postgresql://tutaly_owner:[PASSWORD]@ep-[ID].us-east-1.aws.neon.tech/tutaly_db?sslmode=require
That is the only change. Everything else stays identical.

STEP 6 — Update TypeORM Configuration
Neon requires SSL. Check your database.module.ts to make sure SSL is configured:
typescript// apps/api/src/database/database.module.ts

TypeOrmModule.forRoot({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false  // required for Neon
  },
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false, // NEVER change this
  logging: process.env.NODE_ENV === 'development',
})
Also update your data-source.ts for the TypeORM CLI:
typescript// apps/api/src/database/data-source.ts

import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  synchronize: false,
});

STEP 7 — Set Up Connection Pooling (Important)
Neon has built-in PgBouncer connection pooling. For a NestJS app you should use the pooled connection string not the direct connection string:
Direct connection (for migrations only):
postgresql://tutaly_owner:XX@ep-XX.us-east-1.aws.neon.tech/tutaly_db?sslmode=require

Pooled connection (for your app — use this in DATABASE_URL):
postgresql://tutaly_owner:XX@ep-XX-pooler.us-east-1.aws.neon.tech/tutaly_db?sslmode=require&pgbouncer=true
Notice the difference: -pooler in the hostname and &pgbouncer=true at the end.
Use the pooled connection for your app runtime and the direct connection only when running migrations:
bash# In package.json scripts — use direct URL for migrations:
"migration:run": "typeorm migration:run -d src/database/data-source.ts"

# Add a separate env variable for direct connection:
# DATABASE_DIRECT_URL=postgresql://...direct connection...
# DATABASE_URL=postgresql://...pooled connection...
Update data-source.ts to use the direct URL:
typescript// data-source.ts — uses direct connection for CLI
url: process.env.DATABASE_DIRECT_URL || process.env.DATABASE_URL,

STEP 8 — Verify Migration History
After running migrations on Neon, verify everything is correct:
bash# Check all migrations ran successfully
cd apps/api
pnpm migration:show

# Should show all migrations as [X] (run)
# Example:
# [X] 1 InitialSchema1775952082088
# [X] 2 AddJobLocationColumns
# [X] 3 AddAdCampaignEntities
# etc.
Also verify in Neon dashboard:
Neon Dashboard → Your Project → Tables
Should show all your tables listed

STEP 9 — Test Everything Locally
bash# Start your API locally pointing to Neon
cd apps/api
pnpm start:dev

# Test these endpoints:
# POST /auth/register — creates a user in Neon
# GET /jobs — reads from Neon
# POST /auth/login — reads from Neon

# If all work — migration is successful

STEP 10 — Update GitHub Secrets and Vercel
If you have environment variables stored in GitHub Actions or Vercel:
GitHub Actions:
GitHub repo → Settings → Secrets and variables → Actions
Update DATABASE_URL to Neon connection string
Vercel (for frontend if it calls API directly):
Vercel Dashboard → Project → Settings → Environment Variables
Update DATABASE_URL if used there

STEP 11 — Disable Supabase Project
Once you have confirmed everything works on Neon:
1. Test for 24-48 hours on Neon before disabling Supabase
2. Keep Supabase project alive for 1 week as backup
3. After 1 week of stable Neon operation:
   Supabase Dashboard → Project Settings → Danger Zone → Pause Project
4. Do not delete Supabase yet — keep it paused for 1 month as insurance

IMPORTANT — SUPABASE STORAGE
Neon is database only. It does not have file storage. Your current file storage (CVs, logos, product files, ad creatives) is in Supabase Storage.
You have two options:
Option A — Keep Supabase Storage, move only the database to Neon:
Database:      Neon (new)
File storage:  Supabase Storage (keep as is)
Redis:         Upstash (unchanged)
This is the simplest approach and perfectly fine. Supabase Storage works independently of the Supabase database. You can keep using it even after moving the database to Neon.
Option B — Move everything to AWS S3 (planned for production anyway):
Database:      Neon
File storage:  AWS S3 (production plan from architecture doc)
Redis:         Upstash
This is cleaner long-term but more work now.
Recommendation for now: Option A. Keep Supabase Storage for files, move only the database to Neon. You were planning to move to AWS S3 at production launch anyway. Do that migration in Week 23 as planned.

TELL YOUR DEVELOPER

Migrate the database from Supabase to Neon. Steps:

Create Neon project in us-east-1 region — same as Upstash Redis
Since we are still in development with test data, skip the pg_dump export — run migrations fresh on Neon instead
Add two environment variables:

DATABASE_URL = Neon pooled connection string (for app runtime)
DATABASE_DIRECT_URL = Neon direct connection string (for migration CLI only)


Update database.module.ts — add ssl: { rejectUnauthorized: false }
Update data-source.ts — use DATABASE_DIRECT_URL for TypeORM CLI
Run pnpm migration:run — verify all migrations show as [X] in pnpm migration:show
Test locally — register a user, create a job, confirm data appears in Neon dashboard
Update GitHub Actions secrets with new DATABASE_URL
DO NOT migrate Supabase Storage — keep file storage on Supabase for now, migrate to AWS S3 at production launch in Week 23
Keep Supabase project paused (not deleted) for 1 month as backup
No code changes needed beyond database.module.ts and data-source.ts SSL config and the two environment variables

You said: should i enable neon auth yes or noshould i enable neon auth yes or no12:03 AMClaude responded: No.No.
Tutaly already has its own complete authentication system built with JWT, bcrypt, NestJS guards, and Redis-backed refresh tokens. That is production-grade auth that took a full week to build correctly.
Neon Auth is a separate authentication service built on top of Stack Auth. Enabling it would:

Add a completely redundant auth system alongside the one you already have
Introduce an external dependency you do not need
Potentially conflict with your existing JWT and user table structure
Add unnecessary complexity to a codebase that already handles auth correctly

Neon's job in your architecture is one thing only — be your PostgreSQL database. Nothing else.
Your stack already has every layer covered:
LayerWhat handles itAuthenticationYourClaude's response was interrupted.Try againYou said: Ads Module Backend Finalization# Ads Module Backend Finalization
The backend implementation for the Ads Module is now completely finalized according to the reviewed implementation plan.
## Completed Work
### 1. Database Migrations
- Executed the AdsModuleUpdates migration using TypeORM.
- Used PostgreSQL's native gen_random_uuid() instead of uuid_generate_v4() to resolve extension issues.
- Added a new migration NotificationEnumUpdates to properly register all 10 new ad-related notification types to the NotificationType enum.
### 2. Bull Queue Integration
- Rewrote ads-cron.processor.ts to utilize @nestjs/bull.
- Configured two main recurring jobs:
  - check-ad-budgets runs hourly to pause campaigns that exhaust their budgets or pass their end dates, triggering refund emails when applicable.
  - weekly-ad-report runs every Monday at 8 AM WAT to aggregate performance data across a user's campaigns and email them a comprehensive summary.
### 3. Supabase File Uploads
- Integrated SupabaseClient in AdsService.
- Added a new POST /ads/campaigns/upload-creative endpoint using NestJS FileInterceptor.
- Configured it to upload specifically to the ad-creatives bucket.
- Enforced file type restrictions (PNG, JPG, WebP) and size limits (max 2MB) before upload.
- Returned signed URLs with a 1-hour expiry to keep raw paths secure.
### 4. Controller Endpoints and Security
- Protected POST /ads/campaigns and POST /ads/campaigns/upload-creative with @Roles('employer', 'admin') to block seekers from creating ads.
- Allowed all users (including guests) to interact with GET /ads/active.
- Created GET /ads/campaigns/alerts to securely fetch unread ad-related notifications for the currently authenticated advertiser.
### 5. Notification Logic and Server-Side Enforcement
- Rewrote NotificationService.createAdNotification to seamlessly handle both in-app notification creation and external SendGrid email dispatches.
- Included 10 SendGrid-ready email layouts matching the standard Tutaly design.
- Enforced adCampaignStatusUpdates and adAdminMessages strictly server-side by intercepting updates in AccountSettingsService.
### 6. Payment Model Logged
- Updated AGENT_MEMORY.md to document the unique payment structure of ad campaigns: full total_budget is charged upfront, and 100% of it counts as platform service revenue, skipping the typical 20% commission slice applied to marketplace orders.
- Implemented confirmPayment() in AdsService to reflect this logic.
## Validation Results
- Verified schema alignments for tracking fields (notified_50, notified_80, notified_complete).
- Next.js role enforcement middleware constraints match the NestJS guards logic seamlessly.
- Bull Module successfully bootstrapped within AdsModule alongside AdminModule dependency injection.
No further actions are required for the backend core logic of the Ads module.
is this all ?Show more12:33 AMYou are out of free messages until 4:30 AM