'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiAuth } from '@/lib/api';
import { X, Loader2, CheckCircle2 } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ApplyJobActionProps {
  job: {
    id: string;
    title: string;
  };
}

export default function ApplyJobAction({ job }: ApplyJobActionProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleApplyClick = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) {
      const returnUrl = encodeURIComponent(`/jobs/${job.id}`);
      router.push(`/auth/signup?returnUrl=${returnUrl}`);
    } else {
      setIsModalOpen(true);
      setSubmitted(false);
      setError('');
      setCoverLetter('');
      
      // Auto-fill from user profile API could go here, but for now we leave empty
      // to let the user fill it, ensuring the required fields are sent.
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error("Unauthorized");

      await apiAuth.withToken(token).post(`/jobs/${job.id}/apply`, {
        fullName: fullName.trim(),
        email: email.trim(),
        coverLetter: coverLetter.trim() || undefined,
      });

      setSubmitted(true);
    } catch (err: unknown) {
      const errorObj = err as any;
      const msg = errorObj?.response?.data?.message || errorObj?.message || 'Application failed';
      if (typeof msg === 'string' && msg.toLowerCase().includes('already applied')) {
        setSubmitted(true);
      } else {
        setError(typeof msg === 'string' ? msg : 'Something went wrong.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button className="btn btn--primary btn--lg btn--full" onClick={handleApplyClick}>
        Apply Now
      </button>

      {isModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-c800 border border-c700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-c700">
              <h2 className="text-xl font-bold text-white">Apply for {job.title}</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-c400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {submitted ? (
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green/20 mb-4">
                    <CheckCircle2 className="w-6 h-6 text-green" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Application Submitted!</h3>
                  <p className="text-c400 text-sm mb-6">
                    Your application for <strong>{job.title}</strong> has been sent to the employer.
                  </p>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn--primary btn--full"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="composer">
                  <p className="text-c300 text-sm mb-5">
                    Please provide your contact details to complete the application.
                  </p>

                  <div className="form-group mb-5">
                    <div className="form-label text-white text-sm mb-2 font-medium">Full Name <span className="text-red-500">*</span></div>
                    <input 
                      type="text"
                      required
                      className="input w-full" 
                      placeholder="e.g. Jane Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div className="form-group mb-5">
                    <div className="form-label text-white text-sm mb-2 font-medium">Email <span className="text-red-500">*</span></div>
                    <input 
                      type="email"
                      required
                      className="input w-full" 
                      placeholder="e.g. jane@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-group mb-5">
                    <div className="form-label text-white text-sm mb-2 font-medium">Cover Letter (Optional)</div>
                    <textarea 
                      className="input w-full" 
                      placeholder="Why are you a good fit for this role?"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      style={{ minHeight: '120px', resize: 'vertical' }}
                    ></textarea>
                  </div>

                  {error && (
                    <div className="p-3 mb-5 text-sm text-red-500 bg-red-500/10 rounded-lg border border-red-500/20">
                      {error}
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)}
                      className="btn btn--ghost"
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn--primary"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Application'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
