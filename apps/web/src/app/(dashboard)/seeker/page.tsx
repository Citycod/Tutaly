'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Megaphone,
  ChevronRight,
  Check,
  Circle,
  Loader2,
  Briefcase
} from 'lucide-react';
import { apiAuth } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

export default function SeekerOverviewPage() {
  const [stats, setStats] = useState({
    applicationsCount: 0,
    savedJobsCount: 0,
    profileViews: 0,
    profileStrength: 0,
    recentApplications: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        const res = await apiAuth.withToken(token).get('/jobs/seeker/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load seeker stats', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <Card className="bg-zinc-900 border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between p-4 relative overflow-hidden">
        <div className="flex items-start sm:items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
            <Megaphone className="w-5 h-5 text-zinc-300" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">Get seen by more employers</h3>
            <p className="text-xs text-zinc-400 mt-1">Run a targeted ad to promote your profile or shop listings — starts at ₦5,000.</p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/advertise">
              Create an ad <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div>
            <CardTitle className="text-xl">Welcome back 👋</CardTitle>
            <CardDescription className="mt-2">
              You have {loading ? '...' : stats.applicationsCount} active applications and {loading ? '...' : stats.savedJobsCount} saved jobs.
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/jobs">Browse new matches</Link>
          </Button>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-zinc-500">Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : stats.applicationsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-zinc-500">Profile views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : stats.profileViews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-zinc-500">Saved jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : stats.savedJobsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-zinc-500">Profile strength</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-zinc-100">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `${stats.profileStrength}%`}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* LEFT COLUMN */}
        <Card className="col-span-2">
          <CardHeader className="border-b border-zinc-800 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent applications</CardTitle>
                <CardDescription className="mt-1">Your latest activity</CardDescription>
              </div>
              <Button variant="link" asChild className="text-zinc-400 hover:text-zinc-50">
                <Link href="/seeker/applications">View all <ChevronRight className="w-4 h-4 ml-1" /></Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-zinc-500" /></div>
            ) : stats.recentApplications.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-sm">
                No recent applications found.
              </div>
            ) : (
              <div className="divide-y divide-zinc-800">
                {stats.recentApplications.map((app: any) => {
                  const initial = app.companyName ? app.companyName.charAt(0).toUpperCase() : 'C';
                  return (
                    <div className="flex items-center justify-between p-6 hover:bg-zinc-900/50 transition-colors" key={app.id}>
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-300">
                          {initial}
                        </div>
                        <div>
                          <div className="font-semibold text-zinc-100">{app.jobTitle}</div>
                          <div className="text-xs text-zinc-400 mt-1">{app.companyName} · {app.jobLocation}</div>
                        </div>
                      </div>
                      <div>
                        <span className="px-3 py-1 bg-zinc-900 border border-zinc-700 text-xs font-semibold rounded-full text-zinc-300 uppercase tracking-wider">
                          {app.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile strength</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-zinc-100 transition-all duration-500 ease-in-out" 
                  style={{ width: `${stats.profileStrength}%` }} 
                />
              </div>
              <p className="text-xs text-zinc-400">
                {stats.profileStrength >= 100 ? 'Your profile is fully complete!' : 'Complete your profile to stand out.'}
              </p>
              
              <div className="space-y-3 pt-4 border-t border-zinc-800">
                <div className="flex items-center gap-2">
                  {stats.profileStrength >= 40 ? <Check className="w-4 h-4 text-zinc-100" /> : <Circle className="w-4 h-4 text-zinc-600" />}
                  <span className={`text-sm ${stats.profileStrength >= 40 ? 'text-zinc-300' : 'text-zinc-500'}`}>Basic Info</span>
                </div>
                <div className="flex items-center gap-2">
                  {stats.profileStrength >= 60 ? <Check className="w-4 h-4 text-zinc-100" /> : <Circle className="w-4 h-4 text-zinc-600" />}
                  <span className={`text-sm ${stats.profileStrength >= 60 ? 'text-zinc-300' : 'text-zinc-500'}`}>Headline & Bio</span>
                </div>
                <div className="flex items-center gap-2">
                  {stats.profileStrength >= 80 ? <Check className="w-4 h-4 text-zinc-100" /> : <Circle className="w-4 h-4 text-zinc-600" />}
                  <span className={`text-sm ${stats.profileStrength >= 80 ? 'text-zinc-300' : 'text-zinc-500'}`}>Resume uploaded</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/seeker/profile">Edit Profile</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your salary insight</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-3xl font-bold text-zinc-100 mb-1">₦820K</div>
              <div className="text-xs text-zinc-500">Median for Product Manager, Lagos</div>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" className="w-full" asChild>
                <Link href="/salaries">Explore salary data</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
