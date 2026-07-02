import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Company Reviews',
  description: 'Read anonymous reviews from verified employees. Discover real company culture across Nigerian industries on Tutaly.',
};

// Mock data for reviews - matches system design
const MOCK_REVIEWS = [
  {
    id: 1,
    company: 'Paystack',
    initials: 'P',
    logoStyle: { background: 'rgba(29,122,58,0.2)', color: '#2DB85A' },
    rating: 4.6,
    reviewCount: '1,847',
    recommendPct: 91,
    title: 'The best tech culture in Lagos, full stop.',
    pros: 'Strong engineering culture with real ownership. Managers actually invest in your growth. Salaries are top-of-market and transparent.',
    cons: 'Pace can be intense during product launches. On-call rotations are demanding for engineering roles.',
    department: 'Product',
    tenure: '3 years',
    location: 'Lagos, Nigeria',
    posted: '2 weeks ago',
  },
  {
    id: 2,
    company: 'Flutterwave',
    initials: 'F',
    logoStyle: { background: 'rgba(27,79,158,0.2)', color: 'var(--blue-l)' },
    rating: 4.2,
    reviewCount: '2,310',
    recommendPct: 84,
    title: 'Fast growth, high expectations — worth it.',
    pros: 'You learn more in 6 months here than 2 years at a slower company. Compensation is competitive and leadership listens.',
    cons: 'Reorgs happen frequently as the company scales. Onboarding could be more structured.',
    department: 'Engineering',
    tenure: '2 years',
    location: 'Lagos, Nigeria',
    posted: '1 month ago',
  },
  {
    id: 3,
    company: 'Stripe',
    initials: 'S',
    logoStyle: { background: 'rgba(201,162,39,0.2)', color: 'var(--gold-h)' },
    rating: 4.0,
    reviewCount: '5,420',
    recommendPct: 78,
    title: 'Hired me remote, paid me global rates.',
    pros: 'Fully distributed team, real ownership of the product. Comp is benchmarked to the role, not to where you happen to live.',
    cons: 'Async communication takes adjustment. Time zone overlap can be limited with some teams.',
    department: 'Engineering',
    tenure: '1.5 years',
    location: 'Remote',
    posted: '3 weeks ago',
  },
];

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <span key={i} className={i < full ? 'star' : 'star star--empty'}>★</span>
    );
  }
  return <>{stars}</>;
}

export default async function ReviewsPage() {
  return (
    <div className="page-shell">
      <header className="page-header">
        <div className="container">
          <div className="page-header__eyebrow">Company reviews</div>
          <h1 className="page-header__title">The honest version of the job description.</h1>
          <p className="page-header__sub">12,000+ companies. Real reviews from real employees, anonymous by default.</p>
          <form action="/reviews/search" className="company-search" role="search" aria-label="Company search" style={{ marginTop: '20px' }}>
            <input
              type="text"
              name="q"
              placeholder="Search a company..."
              aria-label="Search companies"
              required
            />
            <button type="submit">Search</button>
          </form>
        </div>
      </header>

      <div className="container" style={{ padding: '32px 0 80px' }}>
        <div className="layout-split" style={{ padding: 0 }}>

          {/* FILTERS */}
          <aside className="filters" aria-label="Review filters">
            <div className="filters__header">
              <span className="filters__title">Filters</span>
              <span className="filters__clear">Clear all</span>
            </div>
            <div className="filter-group">
              <div className="filter-group__label">Rating</div>
              <label className="filter-option checked"><span className="filter-checkbox"></span> 4★ &amp; up <span className="filter-count">4,210</span></label>
              <label className="filter-option"><span className="filter-checkbox"></span> 3★ &amp; up <span className="filter-count">7,840</span></label>
              <label className="filter-option"><span className="filter-checkbox"></span> Any rating <span className="filter-count">12,000</span></label>
            </div>
            <div className="filter-group">
              <div className="filter-group__label">Industry</div>
              <label className="filter-option"><span className="filter-checkbox"></span> Fintech <span className="filter-count">2,140</span></label>
              <label className="filter-option"><span className="filter-checkbox"></span> Tech &amp; Software <span className="filter-count">3,620</span></label>
              <label className="filter-option"><span className="filter-checkbox"></span> Healthcare <span className="filter-count">980</span></label>
              <label className="filter-option"><span className="filter-checkbox"></span> Logistics <span className="filter-count">740</span></label>
            </div>
            <div className="filter-group">
              <div className="filter-group__label">Company size</div>
              <label className="filter-option"><span className="filter-checkbox"></span> Startup <span className="filter-count">5,200</span></label>
              <label className="filter-option"><span className="filter-checkbox"></span> Mid-size <span className="filter-count">4,100</span></label>
              <label className="filter-option"><span className="filter-checkbox"></span> Enterprise <span className="filter-count">2,700</span></label>
            </div>
          </aside>

          {/* REVIEW LIST */}
          <main aria-label="Company reviews">
            <div className="results-bar">
              <p className="results-count"><strong>12,084</strong> companies</p>
              <div className="results-sort">
                Sort by
                <select aria-label="Sort reviews">
                  <option>Highest rated</option>
                  <option>Most reviewed</option>
                  <option>Recently added</option>
                </select>
              </div>
            </div>

            <div className="review-list">
              {MOCK_REVIEWS.map((review) => (
                <article key={review.id} className="review-full reveal visible">
                  <div className="review-full__head">
                    <div className="review-full__company-row">
                      <div
                        className="review-card__logo"
                        style={{ ...review.logoStyle, width: '48px', height: '48px', fontSize: '17px' }}
                      >
                        {review.initials}
                      </div>
                      <div>
                        <div className="review-card__company" style={{ fontSize: '16px' }}>{review.company}</div>
                        <div className="review-card__stars" aria-label={`Rating: ${review.rating} out of 5`}>
                          <StarRating rating={review.rating} />
                          <span className="review-card__score">{review.rating}</span>
                          <span style={{ fontSize: '11px', color: 'var(--c-500)', marginLeft: '4px' }}>· {review.reviewCount} reviews</span>
                        </div>
                      </div>
                    </div>
                    <span className="badge badge-success">Recommends · {review.recommendPct}%</span>
                  </div>
                  <div className="review-full__title">&ldquo;{review.title}&rdquo;</div>
                  <div className="review-full__body">
                    <div className="review-pro">
                      <span className="review-pro__label">Pros</span>
                      {review.pros}
                    </div>
                    <div className="review-con">
                      <span className="review-con__label">Cons</span>
                      {review.cons}
                    </div>
                  </div>
                  <div className="review-full__footer">
                    <span>{review.department} · {review.tenure} · {review.location}</span>
                    <span>Posted {review.posted}</span>
                  </div>
                </article>
              ))}
            </div>

            <nav className="pagination" aria-label="Review results pages">
              <button className="page-btn" disabled aria-label="Previous page">‹</button>
              <button className="page-btn active" aria-current="page">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">3</button>
              <span style={{ color: 'var(--c-500)', padding: '0 4px' }}>…</span>
              <button className="page-btn">96</button>
              <button className="page-btn" aria-label="Next page">›</button>
            </nav>
          </main>

        </div>
      </div>
    </div>
  );
}
