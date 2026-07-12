'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ShieldCheck, Loader2 } from 'lucide-react';

const StarRating = ({ value, onChange }: { value: number, onChange: (val: number) => void }) => {
  const [hoverValue, setHoverValue] = useState(0);

  const getLabel = (val: number) => {
    switch (val) {
      case 5: return "5 out of 5 — Excellent";
      case 4: return "4 out of 5 — Very good";
      case 3: return "3 out of 5 — Average";
      case 2: return "2 out of 5 — Poor";
      case 1: return "1 out of 5 — Terrible";
      default: return "Select Rating";
    }
  };

  return (
    <div>
      <div className="star-input">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star-input__star ${star <= (hoverValue || value) ? 'filled' : ''}`}
            onMouseEnter={() => setHoverValue(star)}
            onMouseLeave={() => setHoverValue(0)}
            onClick={() => onChange(star)}
          >
            ★
          </span>
        ))}
      </div>
      <div className="star-input__label">{getLabel(hoverValue || value)}</div>
    </div>
  );
};

export default function WriteReviewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    ratingOverall: 0,
    position: '',
    tenure: 'Less than 1 year',
    employmentStatus: 'Current employee',
    reviewTitle: '',
    pros: '',
    cons: '',
    recommend: true,
    confirmed: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleToggleRecommend = () => {
    setFormData(prev => ({ ...prev, recommend: !prev.recommend }));
  };

  const handleCheckboxToggle = () => {
    setFormData(prev => ({ ...prev, confirmed: !prev.confirmed }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.confirmed) {
      alert("Please confirm the information is accurate.");
      return;
    }
    if (formData.ratingOverall === 0) {
      alert('Please provide an overall rating');
      return;
    }
    if (formData.pros.length < 10 || formData.cons.length < 10) {
      alert('Pros and Cons must be at least 10 characters long');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const payload = {
        companyName: formData.companyName,
        ratingOverall: formData.ratingOverall,
        position: formData.position,
        pros: formData.pros,
        cons: formData.cons,
        recommend: formData.recommend,
        displayName: formData.reviewTitle || 'Anonymous Review',
      };

      await api.post('/reviews/companies', payload, config);

      setSuccess(true);
      setTimeout(() => {
        router.push('/reviews');
      }, 3000);
    } catch (e) {
      const err = e as any;
      alert(err.response?.data?.message || 'Failed to submit review');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="page-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'var(--c-800)', border: '1px solid var(--c-700)', borderRadius: 'var(--r-xl)', padding: '32px', maxWidth: '440px', width: '100%', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ width: '64px', height: '64px', background: 'rgba(var(--success-rgb), 0.2)', color: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <ShieldCheck style={{ width: '32px', height: '32px' }} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--c-100)', marginBottom: '8px' }}>Review Submitted!</h2>
          <p style={{ fontSize: '14px', color: 'var(--c-400)', marginBottom: '24px', lineHeight: 1.6 }}>Thank you for your anonymous contribution. Your review is pending moderation and will be published shortly.</p>
          <div style={{ color: 'var(--success)', fontSize: '14px', fontWeight: 600, animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>Redirecting...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <header className="page-header" style={{ textAlign: 'center', borderBottom: 'none' }}>
        <div className="container container--narrow">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)', marginBottom: '16px' }}>
            <div style={{ width: '20px', height: '2px', background: 'var(--gold)' }}></div>
            Company reviews
          </div>
          <h1 className="page-header__title" style={{ marginBottom: '16px' }}>Share your experience</h1>
          <p className="page-header__sub" style={{ fontSize: '16px', maxWidth: '540px', margin: '0 auto', lineHeight: 1.6 }}>
            Help other professionals make informed decisions. Your review is anonymous by default.
          </p>
        </div>
      </header>

      <div className="container" style={{ maxWidth: '680px', padding: '32px 24px 80px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ background: 'var(--c-800)', border: '1px solid var(--c-700)', borderRadius: 'var(--r-xl)', padding: '28px' }}>
            
            <div className="form-section">
              <div className="form-section__title">Which company?</div>
              <div className="form-field" style={{ marginBottom: formData.companyName ? '10px' : '0' }}>
                <label className="form-label" htmlFor="r-company">Company name<span className="required">*</span></label>
                <div className="company-search-select">
                  <input type="text" id="r-company" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Search for a company..." required />
                </div>
              </div>
              {formData.companyName && (
                <div className="company-chip">
                  <div className="company-chip__logo" style={{ background: 'rgba(var(--success-rgb), 0.18)', color: 'var(--success)' }}>
                    {formData.companyName.charAt(0).toUpperCase()}
                  </div>
                  <span className="company-chip__name">{formData.companyName}</span>
                </div>
              )}
            </div>

            <div className="form-section">
              <div className="form-section__title">Overall rating<span className="required">*</span></div>
              <StarRating 
                value={formData.ratingOverall} 
                onChange={(val) => setFormData(prev => ({ ...prev, ratingOverall: val }))} 
              />
            </div>

            <div className="form-section">
              <div className="form-section__title">Your role</div>
              <div className="form-grid-2">
                <div className="form-field">
                  <label className="form-label" htmlFor="r-jobtitle">Job title</label>
                  <input className="input" type="text" id="r-jobtitle" name="position" value={formData.position} onChange={handleChange} placeholder="e.g. Product Manager" />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="r-tenure">Time at company</label>
                  <select className="input" id="r-tenure" name="tenure" value={formData.tenure} onChange={handleChange}>
                    <option>Less than 1 year</option>
                    <option>1–2 years</option>
                    <option>3–5 years</option>
                    <option>5+ years</option>
                  </select>
                </div>
              </div>
              <div className="form-field" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="r-status">Employment status</label>
                <select className="input" id="r-status" name="employmentStatus" value={formData.employmentStatus} onChange={handleChange} style={{ maxWidth: '280px' }}>
                  <option>Current employee</option>
                  <option>Former employee</option>
                </select>
              </div>
            </div>

            <div className="form-section">
              <div className="form-section__title">Review title<span className="required">*</span></div>
              <div className="form-field" style={{ marginBottom: 0 }}>
                <input className="input" type="text" name="reviewTitle" value={formData.reviewTitle} onChange={handleChange} placeholder="Sum up your experience in one line" required />
              </div>
            </div>

            <div className="form-section">
              <div className="form-section__title">Pros<span className="required">*</span></div>
              <div className="form-field" style={{ marginBottom: 0 }}>
                <textarea className="input w-full" name="pros" value={formData.pros} onChange={handleChange} placeholder="What did you like about working here?" maxLength={600} required style={{ minHeight: '120px', resize: 'vertical' }}></textarea>
                <div style={{ fontSize: '11px', color: 'var(--c-500)', marginTop: '8px', textAlign: 'right' }}>{formData.pros.length} / 600</div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-section__title">Cons<span className="required">*</span></div>
              <div className="form-field" style={{ marginBottom: 0 }}>
                <textarea className="input w-full" name="cons" value={formData.cons} onChange={handleChange} placeholder="What could be improved?" maxLength={600} required style={{ minHeight: '120px', resize: 'vertical' }}></textarea>
                <div style={{ fontSize: '11px', color: 'var(--c-500)', marginTop: '8px', textAlign: 'right' }}>{formData.cons.length} / 600</div>
              </div>
            </div>

            <div className="form-section" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>
              <div className="toggle-row" style={{ borderBottom: 'none', paddingTop: 0, paddingBottom: 0, cursor: 'pointer' }} onClick={handleToggleRecommend}>
                <div>
                  <div className="toggle-row__title">Would you recommend this company?</div>
                  <div className="toggle-row__desc">Shown as a badge on your review</div>
                </div>
                <div className={`toggle-switch ${formData.recommend ? 'on' : ''}`}></div>
              </div>
              <div className="check-row" style={{ marginTop: '16px', marginBottom: 0, cursor: 'pointer' }} onClick={handleCheckboxToggle}>
                <span className={`filter-checkbox ${formData.confirmed ? 'checked' : ''}`} style={{ marginTop: '2px' }}></span>
                <span>I understand this review is public and will be posted anonymously, without my name or job title's exact wording revealed.</span>
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={() => router.back()} className="btn btn--ghost" disabled={loading}>Save Draft</button>
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                  Posting...
                </>
              ) : 'Post Review'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
