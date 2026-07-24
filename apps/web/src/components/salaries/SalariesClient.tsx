'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import locationsData from '@/data/locations.json';
import { INDUSTRIES } from '@/lib/constants';

interface SalaryAggregate {
  role: string;
  industry?: string;
  avgSalary: string | number;
  minSalary?: string | number;
  maxSalary?: string | number;
  totalSubmissions: number;
}

interface SalariesClientProps {
  salaries?: unknown[];
  aggregates: SalaryAggregate[];
  popularRoles?: SalaryAggregate[];
  filterMeta?: { industries: string[]; locations: Record<string, Record<string, string[]>> };
}

export default function SalariesClient({ aggregates, popularRoles = [], filterMeta }: SalariesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [roleInput, setRoleInput] = useState(searchParams.get('role') || '');
  const [state, setState] = useState(searchParams.get('state') || '');
  const [area, setArea] = useState(searchParams.get('area') || '');
  const [industry, setIndustry] = useState(searchParams.get('industry') || '');
  const [isOpen, setIsOpen] = useState(false);

  // Cascading location and standard industry data
  const industriesList = INDUSTRIES;
  const states = useMemo(() => Object.keys(locationsData.Nigeria).sort(), []);
  const areas = useMemo(() => {
    if (!state) return [];
    return locationsData.Nigeria[state as keyof typeof locationsData.Nigeria] || [];
  }, [state]);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setState(e.target.value);
    setArea('');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (roleInput) params.set('role', roleInput);
    if (state) params.set('state', state);
    if (area) params.set('area', area);
    if (industry) params.set('industry', industry);
    router.push(`/salaries?${params.toString()}`);
  };

  const handleApply = () => {
    const params = new URLSearchParams();
    if (roleInput) params.set('role', roleInput);
    if (state) params.set('state', state);
    if (area) params.set('area', area);
    if (industry) params.set('industry', industry);
    router.push(`/salaries?${params.toString()}`);
  };

  const handleClear = () => {
    setRoleInput('');
    setState('');
    setArea('');
    setIndustry('');
    router.push('/salaries');
  };

  const featured = aggregates.length > 0 ? aggregates[0] : null;

  return (
    <div className="page-shell">
      <header className="page-header">
        <div className="container">
          <div className="page-header__eyebrow">Salary intelligence</div>
          <h1 className="page-header__title">Know what you&apos;re worth before you walk in.</h1>
          <p className="page-header__sub">Real pay data from verified professionals, in your currency.</p>
          <form className="hero__search" onSubmit={handleSearch} style={{ marginTop: '20px', maxWidth: '640px' }}>
            <div className="hero__search-field">
              <Search className="w-5 h-5" style={{ color: 'var(--c-400)' }} />
              <input 
                type="text" 
                placeholder="Search a job title..." 
                aria-label="Search salary by job title"
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
              />
            </div>
            <button type="submit" className="hero__search-btn">Check Salary</button>
          </form>
        </div>
      </header>

      <div className="container" style={{ padding: '32px 0 80px' }}>
        
        {featured && (
          <div className="salary-card reveal visible" style={{ maxWidth: '100%', marginBottom: '48px' }}>
            <div className="salary-card__header">
              <div>
                <div className="salary-card__role">{featured.role || featured.industry || 'All Roles'}</div>
                <div className="salary-card__loc">📍 Nigeria · All experience levels · {featured.totalSubmissions || 0} reports</div>
              </div>
              <div>
                <div className="salary-card__avg">₦{(Number(featured.avgSalary) / 1000).toFixed(0)}K</div>
                <div className="salary-card__avg-label">median / month</div>
              </div>
            </div>
            <div className="salary-bar-wrap">
              <div className="salary-bar-labels">
                <span>₦{((Number(featured.avgSalary) * 0.7) / 1000).toFixed(0)}K (10th)</span>
                <span>Median</span>
                <span>₦{((Number(featured.avgSalary) * 1.5) / 1000).toFixed(0)}K (90th)</span>
              </div>
              <div className="salary-bar-track">
                <div className="salary-bar-fill" style={{ width: '58%' }}>
                  <div className="salary-bar-marker"></div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
              <span className="badge badge-success">↑ 12% vs last year</span>
              <span className="badge badge-muted">Updated this week</span>
            </div>
          </div>
        )}

        <div className="layout-split" style={{ padding: 0 }}>
          {/* FILTERS */}
          <div className="w-full">
            <button 
              className="md:hidden w-full mb-6 btn btn--ghost flex justify-between items-center bg-c800 border border-c700" 
              onClick={() => setIsOpen(!isOpen)}
            >
              <span>{isOpen ? 'Hide Filters' : 'Show Filters'}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
            <aside className={`filters ${isOpen ? 'block' : 'hidden md:block'}`} aria-label="Salary filters">
              <div className="filters__header">
                <span className="filters__title">Refine</span>
                <span className="filters__clear" onClick={handleClear}>Clear all</span>
              </div>
              <div className="filter-group">
                <div className="filter-group__label">Location</div>
                <div className="flex flex-col gap-2">
                  <div className="filter-range">
                    <select value={state} onChange={handleStateChange} disabled={states.length === 0} className="w-full bg-c700 border border-c600 rounded-sm py-2 px-2 text-xs font-mono text-c100 outline-none focus:border-blue disabled:opacity-50">
                      <option value="">All States</option>
                      {states.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="filter-range">
                    <select value={area} onChange={(e) => setArea(e.target.value)} disabled={areas.length === 0} className="w-full bg-c700 border border-c600 rounded-sm py-2 px-2 text-xs font-mono text-c100 outline-none focus:border-blue disabled:opacity-50">
                      <option value="">All Areas</option>
                      {areas.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="filter-group">
                <div className="filter-group__label">Industry</div>
                <div className="filter-range">
                  <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full bg-c700 border border-c600 rounded-sm py-2 px-2 text-xs font-mono text-c100 outline-none focus:border-blue">
                    <option value="">All Industries</option>
                    {industriesList.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <button onClick={handleApply} className="btn btn--primary w-full">
                  Apply Filters
                </button>
              </div>
            </aside>
          </div>

          {/* BROWSE ROLES */}
          <main aria-label="Browse roles">
            <div className="results-bar">
              <p className="results-count">Browse by <strong>role</strong></p>
              <div className="results-sort">
                Sort by
                <select aria-label="Sort roles">
                  <option>Highest paying</option>
                  <option>Most reported</option>
                  <option>Alphabetical</option>
                </select>
              </div>
            </div>

            <div className="role-grid reveal visible">
              {(aggregates.length > 0 && (aggregates.length > 1 || searchParams.get('role'))) ? aggregates.map((agg, idx) => (
                <div key={idx} className="role-tile">
                  <div>
                    <div className="role-tile__name">{agg.role || searchParams.get('role') || 'All Roles'}</div>
                    <div className="role-tile__count">{agg.totalSubmissions || 0} reported salaries</div>
                  </div>
                  <div className="role-tile__salary">
                    {agg.minSalary && agg.maxSalary 
                      ? `₦${(Number(agg.minSalary) / 1000).toFixed(0)}K–₦${(Number(agg.maxSalary) / 1000).toFixed(0)}K`
                      : `₦${(Number(agg.avgSalary) / 1000).toFixed(0)}K/mo`}
                  </div>
                </div>
              )) : popularRoles.map((role, idx) => (
                <div key={idx} className="role-tile">
                  <div>
                    <div className="role-tile__name">{role.role}</div>
                    <div className="role-tile__count">{role.totalSubmissions} reports</div>
                  </div>
                  <div className="role-tile__salary">
                    {role.minSalary && role.maxSalary 
                      ? `₦${(Number(role.minSalary) / 1000).toFixed(0)}K–₦${(Number(role.maxSalary) / 1000).toFixed(0)}K`
                      : `₦${(Number(role.avgSalary) / 1000).toFixed(0)}K/mo`}
                  </div>
                </div>
              ))}
              {aggregates.length === 0 && searchParams.get('role') && (
                <div style={{ color: 'var(--c-500)', padding: '20px 0' }}>No salary data found for this query.</div>
              )}
            </div>

            <div style={{ marginTop: '40px', padding: '28px', background: 'var(--c-800)', border: '1px solid var(--c-700)', borderRadius: 'var(--r-xl)', textAlign: 'center' }}>
              <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--c-100)', marginBottom: '6px' }}>Don&apos;t see your role?</p>
              <p style={{ fontSize: '13px', color: 'var(--c-400)', marginBottom: '18px' }}>Add your salary anonymously and help the next person negotiate better.</p>
              <Link href="/salaries/submit" className="btn btn--primary">Add Your Salary</Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
