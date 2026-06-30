'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Briefcase,
  MapPin,
  Clock,
  Calendar,
  DollarSign,
  Send,
  Bookmark,
  Flag,
  CheckCircle2,
} from 'lucide-react';
import { apiAuth } from '@/lib/api';
import ApplyModal from './ApplyModal';

const CURRENCY_SYMBOLS: Record<string, string> = {
  NGN: '₦',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

interface Job {
  id: string;
  title: string;
  description: string;
  industry: string;
  role: string;
  jobType: string;
  experienceLevel: string;
  minSalary?: number;
  maxSalary?: number;
  currency: string;
  country: string;
  state: string;
  area?: string;
  workMode: string;
  isFeatured: boolean;
  isUrgent: boolean;
  deadline?: string;
  createdAt: string;
  employer?: { id: string; email: string };
}

export default function JobDetailPanel({ job }: { job: Job | null }) {
  const router = useRouter();
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  if (!job) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col items-center justify-center text-gray-400 text-center">
        <Briefcase className="w-12 h-12 mb-4 text-gray-300" />
        <p className="font-medium">Select a job to view details</p>
        <p className="text-sm mt-1">Click on any listing to see the full description and apply.</p>
      </div>
    );
  }

  const sym = CURRENCY_SYMBOLS[job.currency] || job.currency;

  const handleApplyClick = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      const returnUrl = encodeURIComponent(`/jobs?jobId=${job.id}`);
      router.push(`/auth/signin?returnUrl=${returnUrl}`);
      return;
    }

    // Check if user is a seeker (from stored user obj)
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.role === 'employer') {
          alert('Employers cannot apply to jobs. Please sign in as a job seeker.');
          return;
        }
      }
    } catch {
      // ignore parse errors
    }

    setShowApplyModal(true);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push(`/auth/signin?returnUrl=${encodeURIComponent(`/jobs?jobId=${job.id}`)}`);
      return;
    }
    try {
      await apiAuth.withToken(token).post(`/jobs/${job.id}/save`);
      setSaved(true);
    } catch {
      alert('Could not save this job. You may have already saved it.');
    }
  };

  const handleReport = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push(`/auth/signin`);
      return;
    }

    const reason = prompt('Please describe why you are reporting this job listing:');
    if (!reason || reason.trim().length === 0) return;

    try {
      await apiAuth.withToken(token).post(`/jobs/${job.id}/report`, { reason: reason.trim() });
      alert('Thank you. Your report has been submitted for review.');
    } catch {
      alert('Could not submit report. Please try again.');
    }
  };

  return (
    <>
      <div style={{ background: 'var(--c-800)', borderRadius: 'var(--r-xl)', border: '1px solid var(--c-700)', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--c-700)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--c-100)', marginBottom: '4px' }}>{job.title}</h2>
          <p style={{ fontSize: '14px', color: 'var(--c-400)' }}>{job.employer?.email || 'Confidential Company'}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="tag tag--blue">
              <Briefcase className="w-3 h-3" /> {job.jobType}
            </span>
            <span className="tag tag--green">
              {job.workMode}
            </span>
            <span className="tag" style={{ background: 'var(--c-700)', color: 'var(--c-200)' }}>
              {job.experienceLevel}
            </span>
            {job.isFeatured && (
              <span className="tag tag--gold">
                Featured
              </span>
            )}
            {job.isUrgent && (
              <span className="tag" style={{ background: 'rgba(204,43,43,0.12)', color: 'var(--red)' }}>
                Urgent
              </span>
            )}
          </div>

          <div className="mt-6 space-y-3 text-sm text-[var(--c-300)]">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[var(--c-500)]" />
              {job.area ? `${job.area}, ` : ''}
              {job.state}, {job.country}
            </div>
            {job.minSalary && (
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[var(--c-500)]" />
                <span className="font-medium" style={{ color: '#2DB85A', fontFamily: 'var(--mono)' }}>
                  {sym}
                  {job.minSalary.toLocaleString()}
                  {job.maxSalary ? ` – ${sym}${job.maxSalary.toLocaleString()}` : '+'}
                </span>
                <span className="text-xs text-[var(--c-500)]">/ month</span>
              </div>
            )}
            {job.deadline && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[var(--c-500)]" />
                Deadline: {new Date(job.deadline).toLocaleDateString()}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--c-500)]" />
              Posted {new Date(job.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--c-700)' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--c-100)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
            Description
          </h3>
          <div style={{ fontSize: '14px', color: 'var(--c-300)', lineHeight: '1.65', whiteSpace: 'pre-wrap' }}>
            {job.description}
          </div>
        </div>

        {/* Actions */}
        <div style={{ padding: '24px' }}>
          {applied ? (
            <div style={{ width: '100%', background: 'rgba(29,122,58,0.2)', color: '#2DB85A', fontWeight: 700, padding: '14px', borderRadius: 'var(--r-md)', textAlign: 'center', border: '1px solid rgba(29,122,58,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <CheckCircle2 className="w-5 h-5" />
              Application Submitted
            </div>
          ) : (
            <button
              onClick={handleApplyClick}
              className="btn btn--primary btn--lg"
              style={{ width: '100%' }}
            >
              <Send className="w-4 h-4" />
              Apply Now
            </button>
          )}

          <div className="flex gap-3 mt-3">
            <button
              onClick={handleSave}
              disabled={saved}
              className={`btn flex-1 ${saved ? '' : 'btn--ghost'}`}
              style={{
                background: saved ? 'rgba(27,79,158,0.2)' : undefined,
                color: saved ? 'var(--blue-l)' : undefined,
                borderColor: saved ? 'var(--blue)' : undefined,
              }}
            >
              {saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Saved
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" /> Save
                </>
              )}
            </button>
            <button
              onClick={handleReport}
              className="btn btn--ghost"
              style={{ flexShrink: 0, padding: '12px' }}
              title="Report listing"
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <ApplyModal
          job={job}
          isOpen={showApplyModal}
          onClose={() => setShowApplyModal(false)}
          onSuccess={() => {
            setApplied(true);
            setShowApplyModal(false);
          }}
        />
      )}
    </>
  );
}
