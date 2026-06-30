'use client';

import React, { useEffect, useState } from 'react';
import { serverFetch } from '@/lib/server-fetch';
import Link from 'next/link';

export default function FeaturedJobsCarousel() {
  const [ad, setAd] = useState<any>(null);

  useEffect(() => {
    // We'll just try to get an active ad for 'jobs_sidebar' or any 'sponsored_job' 
    // In a real scenario, the backend should return jobs filtered by format 'sponsored_job'
    const fetchFeaturedJob = async () => {
      try {
        const res = await fetch('/api/ads/active?placement=jobs_sidebar');
        if (res.ok) {
          const data = await res.json();
          if (data.ad && data.ad.format === 'sponsored_job') {
            setAd(data.ad);
            // Log impression
            await fetch('/api/ads/impression', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ campaignId: data.ad.id })
            });
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchFeaturedJob();
  }, []);

  if (!ad) return null;

  const handleClick = async () => {
    try {
      await fetch('/api/ads/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId: ad.id })
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ marginBottom: '32px', border: '1px solid var(--gold-h)', background: 'rgba(201,162,39,0.1)', borderRadius: 'var(--r-xl)', padding: '24px', position: 'relative', overflow: 'hidden' }} className="group">
      <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'var(--gold-h)', fontSize: '11px', fontWeight: 800, padding: '4px 8px', borderRadius: '4px', color: '#000', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px' }}>
        ⭐ Featured
      </div>
      <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--c-100)', marginBottom: '8px' }}>Sponsored Opportunity</h3>
      <p style={{ color: 'var(--c-300)', marginBottom: '16px', maxWidth: '600px', lineHeight: '1.6' }}>
        This is a featured job position. Apply now to fast-track your application!
      </p>
      
      {/* If it's linked to a specific job ID we can link directly, else fallback to target URL */}
      <Link 
        href={ad.job_id ? `/jobs?jobId=${ad.job_id}` : ad.target_url || '#'}
        onClick={handleClick}
        className="btn"
        style={{ background: 'var(--gold-h)', color: '#000', border: 'none' }}
      >
        View Details &rarr;
      </Link>
    </div>
  );
}
