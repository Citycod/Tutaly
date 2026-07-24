'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Megaphone,
  ChevronRight,
  Bookmark,
  Check,
  Circle,
  Loader2
} from 'lucide-react';
import { apiAuth } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

export default function SeekerOverviewPage() {
  const [stats, setStats] = useState({
    applicationsCount: 0,
    savedJobsCount: 0,
    profileViews: 0,
    profileStrength: 0,
    recentApplications: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        const res = await apiAuth.withToken(token).get('/jobs/seeker/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load seeker stats', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <>
      <Link href="/advertise" className="ad-banner" aria-label="Run an ad — promote your profile or listings to employers and buyers">
        <div className="ad-banner__left">
          <div className="ad-banner__icon">
            <Megaphone className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="ad-banner__title">Get seen by more employers</div>
            <div className="ad-banner__desc">Run a targeted ad to promote your profile or shop listings — starts at ₦5,000.</div>
          </div>
        </div>
        <div className="ad-banner__cta">
          <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--gold-h)' }}>Create an ad</span>
          <ChevronRight className="ad-banner__arrow w-4 h-4" />
        </div>
      </Link>

      <div className="dcard" style={{ background: 'linear-gradient(135deg, var(--blue-l), var(--gold-l))', borderColor: 'var(--c-700)', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--c-100)', marginBottom: '4px' }}>Welcome back 👋</div>
            <div style={{ fontSize: '13px', color: 'var(--c-400)' }}>
              You have {loading ? '...' : stats.applicationsCount} active applications and {loading ? '...' : stats.savedJobsCount} saved jobs.
            </div>
          </div>
          <Link href="/jobs" className="btn btn--primary btn--sm">Browse new matches</Link>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-card__label">Applications</div>
          <div className="stat-card__value">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : stats.applicationsCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">Profile views</div>
          <div className="stat-card__value">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : stats.profileViews}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">Saved jobs</div>
          <div className="stat-card__value">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : stats.savedJobsCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">Profile strength</div>
          <div className="stat-card__value" style={{ color: 'var(--gold-h)' }}>{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `${stats.profileStrength}%`}</div>
        </div>
      </div>

      <div className="overview-grid mt-6">
        {/* LEFT COLUMN */}
        <div>
          <div className="dcard">
            <div className="dcard__header">
              <div>
                <div className="dcard__title">Recent applications</div>
                <div className="dcard__sub">Your latest activity</div>
              </div>
              <Link href="/seeker/applications" style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--blue-l)' }}>View all →</Link>
            </div>

            {loading ? (
              <div style={{ padding: '24px', textAlign: 'center' }}><Loader2 className="w-6 h-6 animate-spin mx-auto text-c500" /></div>
            ) : stats.recentApplications.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--c-500)', fontSize: '13px' }}>
                No recent applications found.
              </div>
            ) : (
              stats.recentApplications.map((app: any, idx: number) => {
                const initial = app.companyName ? app.companyName.charAt(0).toUpperCase() : 'C';
                return (
                  <div className="app-row" key={app.id} style={{ marginBottom: idx === stats.recentApplications.length - 1 ? 0 : undefined }}>
                    <div className="app-row__logo" style={{ background: 'var(--blue-l)', color: 'var(--blue-h)' }}>{initial}</div>
                    <div className="app-row__body">
                      <div className="app-row__title">{app.jobTitle}</div>
                      <div className="app-row__meta">{app.companyName} · {app.jobLocation}</div>
                    </div>
                    <div className="app-row__status">
                      <span className={`status--${app.status}`} style={{ padding: '4px 10px', borderRadius: 'var(--r-pill)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                        {app.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          <div className="dcard">
            <div className="dcard__title" style={{ marginBottom: '14px' }}>Profile strength</div>
            <div className="salary-bar-track" style={{ marginBottom: '8px' }}>
              <div className="salary-bar-fill" style={{ width: `${stats.profileStrength}%`, background: 'linear-gradient(90deg, var(--gold-l), var(--gold))', transition: 'width 0.5s ease' }}></div>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--c-500)', marginBottom: '16px' }}>
              {stats.profileStrength >= 100 ? 'Your profile is fully complete!' : 'Complete your profile to stand out.'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', borderTop: '1px solid var(--c-700)' }}>
              {stats.profileStrength >= 40 ? <Check className="w-3.5 h-3.5" stroke="var(--green)" strokeWidth={3} /> : <Circle className="w-3.5 h-3.5" stroke="var(--c-500)" />}
              <span style={{ fontSize: '12.5px', color: stats.profileStrength >= 40 ? 'var(--c-300)' : 'var(--c-500)' }}>Basic Info</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0' }}>
              {stats.profileStrength >= 60 ? <Check className="w-3.5 h-3.5" stroke="var(--green)" strokeWidth={3} /> : <Circle className="w-3.5 h-3.5" stroke="var(--c-500)" />}
              <span style={{ fontSize: '12.5px', color: stats.profileStrength >= 60 ? 'var(--c-300)' : 'var(--c-500)' }}>Headline & Bio</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0' }}>
              {stats.profileStrength >= 80 ? <Check className="w-3.5 h-3.5" stroke="var(--green)" strokeWidth={3} /> : <Circle className="w-3.5 h-3.5" stroke="var(--c-500)" />}
              <span style={{ fontSize: '12.5px', color: stats.profileStrength >= 80 ? 'var(--c-300)' : 'var(--c-500)' }}>Resume uploaded</span>
            </div>
            <Link href="/seeker/profile" className="btn btn--ghost btn--sm btn--full" style={{ marginTop: '14px' }}>Edit Profile</Link>
          </div>

          <div className="dcard">
            <div className="dcard__title" style={{ marginBottom: '14px' }}>Your salary insight</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '26px', fontWeight: 600, color: 'var(--green)', marginBottom: '2px' }}>₦820K</div>
            <div style={{ fontSize: '11.5px', color: 'var(--c-500)', marginBottom: '14px' }}>Median for Product Manager, Lagos</div>
            <Link href="/salaries" className="btn btn--ghost btn--sm btn--full">Explore salary data</Link>
          </div>
        </div>
      </div>
    </>
  );
}
