import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Company Reviews',
  description: 'Read anonymous reviews from verified employees. Discover real company culture across Nigerian industries on Tutaly.',
};

// Mock data for reviews
async function getTopReviews() {
  return [
    {
      id: 1,
      company: 'Paystack',
      initials: 'P',
      rating: '4.8',
      title: 'Great culture, but fast-paced',
      pros: 'The engineering culture here is probably the best in Nigeria. You work with very smart people, the compensation is top-tier, and the benefits (especially health and remote stipends) are excellent. Leadership is transparent about goals.',
      cons: 'It can get very intense during product launches. If you don\'t know how to set boundaries, you will easily work 12-hour days. Onboarding could also be better for mid-level hires.',
      role: 'Senior Backend Engineer',
      posted: '2 days ago',
      recommend: true,
    },
    {
      id: 2,
      company: 'Flutterwave',
      initials: 'F',
      rating: '4.2',
      title: 'Good stepping stone, lots of growth',
      pros: 'You get to work on products that scale across Africa. The brand name opens doors, and you will learn a lot in a very short time. Compensation is above market average.',
      cons: 'Process can sometimes be chaotic and priorities shift rapidly. Middle management needs more training on how to handle teams effectively.',
      role: 'Product Manager',
      posted: '1 week ago',
      recommend: true,
    },
    {
      id: 3,
      company: 'Moniepoint',
      initials: 'M',
      rating: '4.6',
      title: 'Solid engineering, great impact',
      pros: 'Very strong engineering practices. The work you do has direct, visible impact on millions of small businesses. Salary is competitive and paid on time. Good remote work policy.',
      cons: 'Sometimes feels like a startup trying to be a corporate. Promotion cycles can be a bit opaque.',
      role: 'Frontend Engineer',
      posted: '2 weeks ago',
      recommend: true,
    }
  ];
}

export default async function ReviewsPage() {
  const reviews = await getTopReviews();

  return (
    <div className="page-shell">
      <header className="page-header">
        <div className="container">
          <div className="page-header__eyebrow">Reviews</div>
          <h1 className="page-header__title">Inside looks at Nigerian tech companies.</h1>
          <p className="page-header__sub">Read anonymous reviews from verified employees.</p>
        </div>
      </header>

      <div className="container" style={{ padding: '32px 0 80px' }}>
        
        <form action="/reviews/search" className="company-search">
          <input 
            type="text" 
            name="q"
            placeholder="Search for a company..." 
            aria-label="Search companies"
            required
          />
          <button type="submit">Search</button>
        </form>

        <div className="results-bar" style={{ marginTop: '24px' }}>
          <p className="results-count"><strong>{reviews.length}</strong> reviews found</p>
          <div className="results-sort">
            Sort by
            <select aria-label="Sort reviews">
              <option>Most helpful</option>
              <option>Newest first</option>
              <option>Highest rating</option>
              <option>Lowest rating</option>
            </select>
          </div>
        </div>

        <div className="review-list reveal visible">
          {reviews.map((review) => (
            <article key={review.id} className="review-full">
              <div className="review-full__head">
                <div className="review-full__company-row">
                  <div className="review-card__logo">{review.initials}</div>
                  <div>
                    <div className="review-card__company">{review.company}</div>
                    <div className="review-card__stars">
                      <span className="star">★</span>
                      <span className="star">★</span>
                      <span className="star">★</span>
                      <span className="star">★</span>
                      <span className="star">★</span>
                      <span className="review-card__score">{review.rating}</span>
                    </div>
                  </div>
                </div>
                {review.recommend && (
                  <div className="review-card__rec review-card__rec--yes">✓ Recommends</div>
                )}
              </div>

              <h3 className="review-full__title">"{review.title}"</h3>
              
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
                <span className="review-card__role">Current Employee • {review.role}</span>
                <span className="jobcard__posted">{review.posted}</span>
              </div>
            </article>
          ))}
        </div>

        <nav className="pagination" aria-label="Reviews pages">
          <button className="page-btn" disabled aria-label="Previous page">‹</button>
          <button className="page-btn active" aria-current="page">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <span style={{ color: 'var(--c-500)', padding: '0 4px' }}>…</span>
          <button className="page-btn">42</button>
          <button className="page-btn" aria-label="Next page">›</button>
        </nav>
      </div>
    </div>
  );
}
