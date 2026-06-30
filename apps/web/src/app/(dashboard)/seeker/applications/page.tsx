'use client';

import React, { useState, useEffect } from 'react';
import { apiAuth } from '@/lib/api';
import { Briefcase, Building2, MapPin, Calendar, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface SubApplication {
  id: string;
  status: string;
  createdAt: string;
  job: {
    id: string;
    title: string;
    jobType: string;
    workMode: string;
    area: string;
    state: string;
    country: string;
    employer: {
      email: string;
    };
  };
}

export default function SeekerApplicationsPage() {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<SubApplication[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const { data } = await apiAuth.withToken(token).get('/jobs/seeker/applications');
      setApplications(data);
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = e as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = e as any;
setError(err instanceof Error ? err.message : 'Failed to fetch your applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPLIED':
        return <span className="px-3 py-1 bg-blueL text-blueH text-xs font-bold rounded-full border border-blueL">APPLIED</span>;
      case 'REVIEWING':
        return <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full border border-purple-200">REVIEWING</span>;
      case 'SHORTLISTED':
        return <span className="px-3 py-1 bg-green text-green text-xs font-bold rounded-full border border-green">SHORTLISTED</span>;
      case 'OFFERED':
        return <span className="px-3 py-1 bg-green text-green text-xs font-bold rounded-full border border-green">OFFERED</span>;
      case 'REJECTED':
        return <span className="px-3 py-1 bg-red text-red text-xs font-bold rounded-full border border-red">REJECTED</span>;
      default:
        return <span className="px-3 py-1 bg-c100 text-c700 text-xs font-bold rounded-full border border-c200">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="p-8 pb-16 animate-pulse">
        <div className="h-8 bg-c200 rounded w-1/4 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-40 bg-c100 rounded-xl" />
          <div className="h-40 bg-c100 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 pb-16 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-c900">My Applications</h1>
        <p className="text-c500 mt-1">Track the status of jobs you have applied to.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red text-red border border-red rounded-lg text-sm">
          {error}
        </div>
      )}

      {applications.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-c100 text-center shadow-sm">
          <Briefcase className="w-12 h-12 mx-auto mb-4 text-c200" />
          <h3 className="text-lg font-bold text-c900 mb-2">No applications yet</h3>
          <p className="text-c500 text-sm mb-6">You haven&apos;t applied to any jobs. Explore active listings to find your next role.</p>
          <Link href="/jobs" className="inline-flex bg-c900 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-black transition">
            Explore Jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white p-5 rounded-xl border border-c100 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <div className="min-w-0 pr-4">
                  <h3 className="font-bold text-c900 truncate text-lg">
                    {app.job.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-sm text-c500 mt-1">
                    <Building2 className="w-4 h-4 text-c400" />
                    <span className="truncate">{app.job.employer.email.split('@')[0]} Company</span>
                  </div>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-2 text-right">
                  {getStatusBadge(app.status)}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-c600 mb-6">
                 <span className="bg-c100 px-2 py-1 rounded border border-c100">
                    {app.job.jobType}
                 </span>
                 <span className="bg-c100 px-2 py-1 rounded border border-c100">
                    {app.job.workMode}
                 </span>
                 <span className="flex items-center gap-1 bg-c100 px-2 py-1 rounded border border-c100">
                    <MapPin className="w-3 h-3 text-c400" />
                    {app.job.area ? `${app.job.area}, ` : ''}{app.job.state}
                 </span>
              </div>

              <div className="flex items-center justify-between border-t border-c100 pt-4 mt-auto">
                 <div className="flex items-center gap-1.5 text-xs text-c400">
                   <Calendar className="w-3.5 h-3.5" />
                   Applied {new Date(app.createdAt).toLocaleDateString()}
                 </div>
                 
                 <Link href={`/jobs?jobId=${app.job.id}`} className="text-sm font-medium text-green flex items-center gap-1 hover:text-green">
                    View Posting <ExternalLink className="w-3.5 h-3.5" />
                 </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
