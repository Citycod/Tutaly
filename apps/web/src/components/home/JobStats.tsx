'use client';

import { useEffect, useState } from 'react';

export default function JobStats({ initialTotal }: { initialTotal: number }) {
  const [total, setTotal] = useState(initialTotal > 0 ? initialTotal : 2418);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        setTotal(prev => prev + 1);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="stats-row">
      <div>
        <div className="stat-num">{total.toLocaleString()}</div>
        <div className="stat-label">Active jobs</div>
        <div className="stat-delta">+14 today</div>
      </div>
      <div>
        <div className="stat-num">850+</div>
        <div className="stat-label">Companies hiring</div>
      </div>
      <div>
        <div className="stat-num">18k+</div>
        <div className="stat-label">Members</div>
        <div className="stat-delta">+83 this week</div>
      </div>
      <div>
        <div className="stat-num">4.2k+</div>
        <div className="stat-label">Salary reports</div>
      </div>
    </div>
  );
}
