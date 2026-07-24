'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiAuth } from '@/lib/api';
import { Loader2, ArrowRight, X, Sparkles, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

export default function EmployerOverviewPage() {
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplicants: 0,
    pendingJobs: 0,
    totalJobs: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showAd, setShowAd] = useState(true);

  const [companyName, setCompanyName] = useState('Employer');

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        const resStats = await apiAuth.withToken(token).get('/jobs/employer/stats');
        setStats(resStats.data);

        try {
           const profileRes = await apiAuth.withToken(token).get('/user/employer/profile');
           if (profileRes.data?.companyName) {
             setCompanyName(profileRes.data.companyName);
           }
        } catch(e) {}

      } catch (err) {
        console.error('Failed to load dashboard stats', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {showAd && (
        <Card className="bg-zinc-900 border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between p-4 relative overflow-hidden">
          <div className="flex items-start sm:items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-zinc-300" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Get more qualified applicants</h3>
              <p className="text-xs text-zinc-400 mt-1">Boost your job posts to the top of search results — starts at ₦15,000.</p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-4 flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/employer/advertise">
                Create a campaign <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <button className="text-zinc-500 hover:text-zinc-300 transition-colors" onClick={() => setShowAd(false)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div>
            <CardTitle className="text-xl">Welcome back, {companyName} 👋</CardTitle>
            <CardDescription className="mt-2">You have {stats.totalApplicants} total applicants across {stats.activeJobs} active job posts.</CardDescription>
          </div>
          <Button asChild>
            <Link href="/employer/jobs/create">Post a new job</Link>
          </Button>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-zinc-500">Active job posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : stats.activeJobs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-zinc-500">Total applicants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : stats.totalApplicants}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-zinc-500">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : stats.pendingJobs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-zinc-500">Total Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : stats.totalJobs}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader className="border-b border-zinc-800 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your job posts</CardTitle>
                <CardDescription className="mt-1">Recent listings and performance</CardDescription>
              </div>
              <Button variant="link" asChild className="text-zinc-400 hover:text-zinc-50">
                <Link href="/employer/jobs">View all</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center py-8 text-zinc-500">
              <Building2 className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm mb-4">View and manage all your active listings.</p>
              <Button variant="outline" asChild>
                <Link href="/employer/jobs">Manage Jobs</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hiring pipeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span className="text-sm text-zinc-400">Pending Review</span>
                </div>
                <span className="font-mono text-sm font-medium">{loading ? '-' : stats.pendingJobs}</span>
              </div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-sm text-zinc-400">Total Applicants</span>
                </div>
                <span className="font-mono text-sm font-medium">{loading ? '-' : stats.totalApplicants}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" className="w-full" asChild>
                <Link href="/employer/jobs">View applicants</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current plan</CardTitle>
              <CardDescription className="pt-2 text-zinc-100 font-semibold">Growth Plan</CardDescription>
              <CardDescription>Unlimited job posts</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/employer/billing">Manage plan</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
