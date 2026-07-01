'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SalariesClientProps {
  salaries: any[];
  aggregates: any[];
}

const CATEGORIES = [
  'All', 'Engineering', 'Product', 'Design', 'Data', 'Marketing', 'Sales', 'Customer Success'
];

export default function SalariesClient({ salaries, aggregates }: SalariesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState({
    role: searchParams.get('role') || '',
    industry: searchParams.get('industry') || '',
  });

  const [activeCategory, setActiveCategory] = useState('All');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filters.role) params.set('role', filters.role);
    if (activeCategory !== 'All') params.set('industry', activeCategory);
    router.push(`/salaries?${params.toString()}`);
  };

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    const params = new URLSearchParams();
    if (filters.role) params.set('role', filters.role);
    if (cat !== 'All') params.set('industry', cat);
    router.push(`/salaries?${params.toString()}`);
  };

  return (
    <div className="page-shell">
      <header className="page-header">
        <div className="container">
          <div className="page-header__eyebrow">Salaries</div>
          <h1 className="page-header__title">Know your worth in the Nigerian market.</h1>
          <p className="page-header__sub">Explore salary data crowdsourced from thousands of tech professionals.</p>
        </div>
      </header>

      <div className="container" style={{ padding: '32px 0 80px' }}>
        <form className="company-search" style={{ marginBottom: '24px' }} onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search for a role (e.g., Product Manager)..." 
            aria-label="Search roles"
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          />
          <button type="submit">Search</button>
        </form>

        <div className="category-rail" role="list">
          {CATEGORIES.map(cat => (
            <span 
              key={cat}
              className={`cat-pill ${activeCategory === cat ? 'active' : ''}`} 
              role="listitem"
              onClick={() => handleCategoryClick(cat)}
            >
              {cat}
            </span>
          ))}
        </div>

        <div className="results-bar">
          <p className="results-count"><strong>{aggregates.length}</strong> roles found</p>
          <div className="results-sort">
            Sort by
            <select aria-label="Sort roles">
              <option>Highest paid</option>
              <option>Most reports</option>
              <option>A-Z</option>
            </select>
          </div>
        </div>

        <div className="role-grid reveal visible">
          {aggregates.map((agg, idx) => (
            <div key={idx} className="role-tile">
              <div>
                <div className="role-tile__name">{agg.role || agg.industry || 'All Roles'}</div>
                <div className="role-tile__count">{agg.totalSubmissions || 0} reported salaries</div>
              </div>
              <div className="role-tile__salary">₦{(Number(agg.avgSalary) / 1000).toFixed(0)}k/mo</div>
            </div>
          ))}
          {aggregates.length === 0 && (
            <div style={{ color: 'var(--c-500)', padding: '20px 0' }}>No salary data found for this query.</div>
          )}
        </div>
      </div>
    </div>
  );
}
