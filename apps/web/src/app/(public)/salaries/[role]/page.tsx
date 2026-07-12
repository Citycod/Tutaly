import Link from "next/link";
import { serverFetch } from "@/lib/server-fetch";

function formatMoney(num: number) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
  return num.toLocaleString();
}

export default async function SalaryRolePage(props: { params: Promise<{ role: string }> }) {
  const params = await props.params;
  // Decode role from URL (e.g., product-manager -> Product Manager)
  const roleName = params.role
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  let aggregates: any[] = [];
  let recentSubmissions: any[] = [];
  
  try {
    const [aggRes, recentRes] = await Promise.all([
      serverFetch<any>(`salaries/aggregates?role=${encodeURIComponent(roleName)}`, { cache: 'no-store' }),
      serverFetch<any>(`salaries?role=${encodeURIComponent(roleName)}&limit=10`, { cache: 'no-store' })
    ]);
    aggregates = aggRes?.data || [];
    recentSubmissions = recentRes?.data || [];
  } catch (err) {
    // silently fail
  }

  const agg = aggregates.length > 0 ? aggregates[0] : null;
  const totalSubmissions = agg ? agg.totalSubmissions : 0;
  const avgSalary = agg ? Number(agg.avgSalary) : 0;
  const minSalary = agg ? Number(agg.minSalary) : 0;
  const maxSalary = agg ? Number(agg.maxSalary) : 0;
  const currency = agg?.currency === 'NGN' ? '₦' : agg?.currency === 'USD' ? '$' : agg?.currency === 'GBP' ? '£' : agg?.currency === 'EUR' ? '€' : (agg?.currency || '₦');
  const salaryPeriod = agg?.salaryPeriod || 'monthly';

  // Estimate percentiles for UI purposes
  const p25 = minSalary + (avgSalary - minSalary) / 2;
  const p75 = avgSalary + (maxSalary - avgSalary) / 2;

  return (
    <div className="page-shell">
      <div className="container" style={{ paddingTop: '28px' }}>
        
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/salaries">Salaries</Link>
          <span>/</span>
          <span className="current">{roleName}</span>
        </nav>

        <div className="salary-detail-header">
          <div>
            <h1 className="salary-detail-header__title">{roleName} salary</h1>
            <div className="salary-detail-header__sub">
              📍 Nigeria &middot; {totalSubmissions} reports &middot; Updated recently
            </div>
          </div>
          <Link href="/salaries/submit" className="btn btn--primary">
            Add Your Salary
          </Link>
        </div>

        {totalSubmissions > 0 ? (
          <>
            <div className="salary-card" style={{ maxWidth: '100%', marginBottom: '24px' }}>
              <div className="salary-card__header">
                <div>
                  <div className="salary-card__role">Average {salaryPeriod} salary</div>
                  <div className="salary-card__loc">All experience levels &middot; Nigeria</div>
                </div>
                <div>
                  <div className="salary-card__avg">{currency}{formatMoney(avgSalary)}</div>
                  <div className="salary-card__avg-label">per {salaryPeriod.replace('ly', '')}</div>
                </div>
              </div>

              <div className="percentile-grid">
                <div className="percentile-tile">
                  <div className="percentile-tile__label">Minimum</div>
                  <div className="percentile-tile__value">{currency}{formatMoney(minSalary)}</div>
                </div>
                <div className="percentile-tile">
                  <div className="percentile-tile__label">Lower</div>
                  <div className="percentile-tile__value">{currency}{formatMoney(p25)}</div>
                </div>
                <div className="percentile-tile median">
                  <div className="percentile-tile__label">Average</div>
                  <div className="percentile-tile__value">{currency}{formatMoney(avgSalary)}</div>
                </div>
                <div className="percentile-tile">
                  <div className="percentile-tile__label">Upper</div>
                  <div className="percentile-tile__value">{currency}{formatMoney(p75)}</div>
                </div>
                <div className="percentile-tile">
                  <div className="percentile-tile__label">Maximum</div>
                  <div className="percentile-tile__value">{currency}{formatMoney(maxSalary)}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <span className="badge badge--new">{totalSubmissions} data points</span>
              </div>
            </div>

            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--c-100)', margin: '32px 0 16px' }}>
              Recent Submissions
            </div>
            <div className="salary-card" style={{ padding: '0', overflow: 'hidden', marginBottom: '64px' }}>
              {recentSubmissions.length > 0 ? (
                <table className="breakdown-table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '16px 20px' }}>Role</th>
                      <th style={{ padding: '16px 20px' }}>Experience</th>
                      <th style={{ padding: '16px 20px', textAlign: 'right' }}>Base Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSubmissions.map((sub: any, i: number) => (
                      <tr key={i}>
                        <td style={{ padding: '16px 20px' }}>{sub.role}</td>
                        <td style={{ padding: '16px 20px' }}>{sub.yearsOfExperience || 'N/A'} yrs</td>
                        <td className="num" style={{ padding: '16px 20px', color: 'var(--success)' }}>
                          {sub.currency}{formatMoney(Number(sub.salaryAmount))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--c-400)', fontSize: '14px' }}>
                  No recent submissions found.
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="salary-card" style={{ textAlign: 'center', padding: '48px 24px', marginBottom: '64px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>Not enough data</h3>
            <p style={{ color: 'var(--c-400)', fontSize: '14px', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
              We don't have enough salary reports for <strong>{roleName}</strong> yet. Contribute your anonymous salary to help others understand the market!
            </p>
            <Link href="/salaries/submit" className="btn btn--primary">
              Submit Salary Anonymously
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
