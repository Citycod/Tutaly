'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiAuth } from '@/lib/api';
import { Briefcase, Heart, Search, User, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SeekerOverviewPage() {
  const [userEmail, setUserEmail] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSeekerDetails() {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;
        
        const [meRes, profileRes] = await Promise.all([
          apiAuth.withToken(token).get('/user/me'),
          apiAuth.withToken(token).get('/user/seeker/profile')
        ]);
        
        setUserEmail(meRes.data.data?.email || 'Professional');
        setProfile(profileRes.data);
      } catch (err) {
        console.error("Failed to load seeker data", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchSeekerDetails();
  }, []);

  const calculateCompletion = () => {
    if (!profile) return 0;
    let score = 0;
    if (profile.firstName && profile.lastName) score += 20;
    if (profile.headline) score += 20;
    if (profile.bio) score += 20;
    if (profile.skills && profile.skills.length > 0) score += 20;
    if (profile.resumeUrl) score += 20;
    return score;
  };

  const completionScore = calculateCompletion();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--c-100)' }}>Your Dashboard</h1>
          <p style={{ color: 'var(--c-400)', marginTop: '8px' }}>Welcome back, {loading ? '...' : (profile?.firstName ? `${profile.firstName} ${profile.lastName}` : userEmail)}</p>
        </div>
        <Link 
          href="/jobs" 
          className="btn btn--primary"
          style={{ flexShrink: 0 }}
        >
          <Search className="w-5 h-5" /> Find Jobs
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {/* Quick Action Cards */}
        <Link href="/seeker/applications" className="group block">
          <div style={{ background: 'var(--c-800)', borderRadius: 'var(--r-xl)', border: '1px solid var(--c-700)', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: '100%', transition: 'all 0.2s' }} className="hover:border-[var(--blue)] hover:shadow-[0_4px_24px_rgba(27,79,158,0.2)]">
            <div className="bg-[#1D7A3A]/15 p-4 rounded-full text-[#2DB85A] mb-4 transition-transform duration-200 group-hover:scale-110">
              <Briefcase className="w-8 h-8" />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--c-100)' }}>My Applications</h3>
            <p style={{ fontSize: '14px', color: 'var(--c-400)', marginTop: '8px' }}>Track the status of roles you have applied for.</p>
          </div>
        </Link>
        
        <Link href="/seeker/saved" className="group block">
          <div style={{ background: 'var(--c-800)', borderRadius: 'var(--r-xl)', border: '1px solid var(--c-700)', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: '100%', transition: 'all 0.2s' }} className="hover:border-[var(--red)] hover:shadow-[0_4px_24px_rgba(204,43,43,0.15)]">
            <div className="bg-red/15 p-4 rounded-full text-red mb-4 transition-transform duration-200 group-hover:scale-110">
              <Heart className="w-8 h-8" />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--c-100)' }}>Saved Jobs</h3>
            <p style={{ fontSize: '14px', color: 'var(--c-400)', marginTop: '8px' }}>View the opportunities you bookmarked for later.</p>
          </div>
        </Link>

        {/* Profile Completion Card */}
        <Link href="/seeker/profile" className="group block sm:col-span-2 lg:col-span-1">
          <div className="bg-gradient-to-br from-blue/10 to-blue/5 rounded-xl border border-blue p-6 flex flex-col h-full relative overflow-hidden">
            <div style={{ position: 'absolute', top: '-16px', right: '-16px', width: '96px', height: '96px', background: 'var(--blue)', opacity: 0.1, borderRadius: '50%', filter: 'blur(24px)' }}></div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="bg-blue/20 p-3 rounded-md text-blueL">
                <User className="w-6 h-6" />
              </div>
              <div className="text-right">
                <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--c-100)' }}>{completionScore}%</span>
                <p style={{ fontSize: '12px', color: 'var(--blue-l)' }}>Profile complete</p>
              </div>
            </div>
            
            <div style={{ width: '100%', background: 'var(--c-800)', borderRadius: '999px', height: '8px', marginBottom: '16px' }}>
              <div style={{ background: 'var(--blue)', height: '8px', borderRadius: '999px', width: `${completionScore}%`, transition: 'width 1s ease-in-out' }}></div>
            </div>

            <div className="mt-auto space-y-2 relative z-10">
              {completionScore < 100 ? (
                <>
                  {!profile?.headline && <p style={{ fontSize: '14px', color: 'var(--c-300)', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertCircle className="w-4 h-4 text-[var(--gold-h)]" /> Add a headline</p>}
                  {!profile?.resumeUrl && <p style={{ fontSize: '14px', color: 'var(--c-300)', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertCircle className="w-4 h-4 text-[var(--gold-h)]" /> Upload your CV</p>}
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--blue-l)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>Complete Profile &rarr;</p>
                </>
              ) : (
                <div className="flex items-center gap-2 text-[#2DB85A]">
                  <CheckCircle2 className="w-5 h-5" />
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>Your profile is looking great!</span>
                </div>
              )}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
