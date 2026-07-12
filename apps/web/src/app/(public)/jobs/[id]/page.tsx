import Link from "next/link";
import { notFound } from "next/navigation";
import { serverFetch } from "@/lib/server-fetch";
import ApplyJobAction from "@/components/jobs/ApplyJobAction";

function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

export default async function JobDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  let job;
  try {
    job = await serverFetch<any>(`jobs/${params.id}`, { cache: 'no-store' });
  } catch (err) {
    console.error(`[JobDetailPage] Failed to fetch job with ID ${params.id}:`, err);
    return notFound();
  }

  if (!job) {
    return notFound();
  }

  // Handle case where global interceptor wraps data in { success: true, data: { ... } }
  if (job.success !== undefined && job.data) {
    job = job.data;
  }

  const sym = job.currency === 'NGN' ? '₦' : job.currency === 'USD' ? '$' : job.currency === 'GBP' ? '£' : job.currency === 'EUR' ? '€' : job.currency;

  const companyInitial = job.employer?.companyName ? job.employer.companyName.substring(0, 1).toUpperCase() : 'C';
  const companyName = job.employer?.companyName || "Confidential Company";
  
  // Format description into paragraphs/lists based on hyphens
  const descriptionLines = job.description 
    ? job.description.split('\n').map((l: string) => l.trim()).filter(Boolean)
    : [];

  return (
    <div className="page-shell">
      <div className="container" style={{ paddingTop: '28px' }}>
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/jobs">Jobs</Link>
          <span>/</span>
          <Link href={`/jobs?keyword=${encodeURIComponent(job.industry || 'Tech')}`}>
            {job.industry || 'Tech'}
          </Link>
          <span>/</span>
          <span className="current">{job.title} at {companyName}</span>
        </nav>

        <div className="job-detail-layout">
          {/* LEFT: JOB CONTENT */}
          <main>
            <div className="job-header">
              <div className="job-header__logo" style={{ background: 'var(--success-rgb)', color: 'var(--success)' }}>
                {companyInitial}
              </div>
              <div>
                <h1 className="job-header__title">{job.title}</h1>
                <div className="job-header__company">{companyName}</div>
                <div className="job-header__meta">
                  <span>📍 {job.area ? `${job.area}, ` : ''}{job.state}, {job.country}</span>
                  <span>🏢 {job.workMode}</span>
                  <span>👤 {job.experienceLevel}</span>
                  <span>🕐 Posted {formatTimeAgo(job.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="job-section">
              <div className="job-section__title">About the role</div>
              <div className="job-section__body">
                {descriptionLines.length > 0 ? (
                  descriptionLines.map((line: string, idx: number) => {
                    if (line.startsWith('-')) {
                      return (
                        <ul key={idx} style={{ margin: '0 0 14px 20px' }}>
                          <li style={{ marginBottom: '8px' }}>{line.substring(1).trim()}</li>
                        </ul>
                      );
                    }
                    return <p key={idx} style={{ marginBottom: '14px' }}>{line}</p>;
                  })
                ) : (
                  <p>No description provided.</p>
                )}
              </div>
            </div>
          </main>

          {/* RIGHT: APPLY BOX */}
          <aside>
            <div className="apply-box">
              <div className="apply-box__salary">
                {sym}{job.minSalary ? job.minSalary.toLocaleString() : 'Negotiable'}
                {job.maxSalary ? ` – ${sym}${job.maxSalary.toLocaleString()}` : ''}
              </div>
              <div className="apply-box__salary-note">
                per month &middot;{" "}
                {job.role ? (
                  <Link href={`/salaries/${job.role.toLowerCase().replace(/\s+/g, '-')}`} style={{ color: 'var(--blue-l)' }}>
                    See full salary breakdown &rarr;
                  </Link>
                ) : (
                  <Link href={`/salaries`} style={{ color: 'var(--blue-l)' }}>
                    See salaries &rarr;
                  </Link>
                )}
              </div>

              <div className="apply-box__stat-row">
                <span className="apply-box__stat-label">Applicants</span>
                <span className="apply-box__stat-value">{job.applicantsCount || 0}</span>
              </div>
              <div className="apply-box__stat-row">
                <span className="apply-box__stat-label">Job type</span>
                <span className="apply-box__stat-value">{job.jobType}</span>
              </div>
              <div className="apply-box__stat-row">
                <span className="apply-box__stat-label">Experience</span>
                <span className="apply-box__stat-value">{job.experienceLevel}</span>
              </div>

              <ApplyJobAction job={{ id: params.id, title: job.title }} />
              
              <button className="btn btn--ghost btn--full" style={{ marginTop: '10px' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px', verticalAlign: 'text-bottom', display: 'inline-block' }}>
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                </svg>
                Save Job
              </button>

              <div className="company-mini-card">
                <div className="company-mini-card__logo" style={{ background: 'var(--success-rgb)', color: 'var(--success)' }}>
                  {companyInitial}
                </div>
                <div>
                  <div className="company-mini-card__name">{companyName}</div>
                  <div className="company-mini-card__meta">
                    {job.employer?.reviewScore ? `${job.employer.reviewScore} ★ · ` : ''}
                    {job.employer?.reviewCount ? `${job.employer.reviewCount} reviews` : 'No reviews yet'}
                  </div>
                </div>
              </div>
              {job.employer?.email && (
                <Link href={`/reviews/company/${job.employer.email.split('@')[0]}`} className="btn btn--ghost btn--sm btn--full" style={{ marginTop: '10px' }}>
                  Read company reviews
                </Link>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
