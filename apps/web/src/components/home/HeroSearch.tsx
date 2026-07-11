'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function HeroSearch() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('keyword', keyword.trim());
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="hero__search" role="search" aria-label="Job search">
      <div className="hero__search-field">
        <Search className="w-4 h-4" aria-hidden="true" />
        <input
          type="text"
          name="keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Job title, skills, or company..."
          aria-label="Search jobs by title, skills, or company"
        />
      </div>
      <button type="submit" className="hero__search-btn">
        Search Jobs
      </button>
    </form>
  );
}
