import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, Briefcase, Zap, Shield, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Post Jobs for Free',
  description: 'Post your open roles on Tutaly for free. Reach thousands of active Nigerian professionals quickly and easily.',
};

export default function FreeJobPostingPage() {
  return (
    <div className="min-h-screen bg-c100 pt-20 pb-16">
      {/* Hero */}
      <section className="bg-navy py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Hire Top Nigerian Talent for Free
          </h1>
          <p className="text-xl text-c300 mb-10 max-w-2xl mx-auto font-light">
            No credit card required. Post your open roles and instantly reach thousands of active job seekers across Nigeria.
          </p>
          <Link 
            href="/auth/signup?role=employer" 
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green px-8 py-4 text-lg font-bold text-white shadow-lg hover:bg-green hover:-translate-y-1 transition-all"
          >
            Create Employer Account <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-sm text-c400 mt-4">Takes less than 2 minutes to get started.</p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-c900">Why Post on Tutaly?</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-c100 text-center">
            <div className="w-16 h-16 bg-green text-green rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-c900 mb-3">Instant Reach</h3>
            <p className="text-c600">Your job is published instantly and pushed to relevant candidates via our smart matching engine.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-c100 text-center">
            <div className="w-16 h-16 bg-green text-green rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-c900 mb-3">Quality Candidates</h3>
            <p className="text-c600">Our platform attracts serious professionals looking for genuine career growth opportunities.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-c100 text-center">
            <div className="w-16 h-16 bg-green text-green rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-c900 mb-3">Verified Trust</h3>
            <p className="text-c600">Employers are verified to ensure a safe, scam-free environment for our job seekers.</p>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="bg-white py-20 border-t border-c200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-c900">Simple, Transparent Pricing</h2>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl border border-c200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-c100 border-b border-c200">
                  <th className="p-6 text-lg font-bold text-c900 w-1/2">Features</th>
                  <th className="p-6 text-center w-1/4 border-l border-c200">
                    <span className="block text-xl font-bold text-c900 mb-1">Free</span>
                    <span className="text-sm text-c500 font-normal">₦0 / forever</span>
                  </th>
                  <th className="p-6 text-center w-1/4 bg-green border-l border-green">
                    <span className="block text-xl font-bold text-green mb-1">Premium</span>
                    <span className="text-sm text-green font-normal">Coming Soon</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-c200">
                <tr>
                  <td className="p-6 text-c700 font-medium">Active Job Posts</td>
                  <td className="p-6 text-center text-c900 font-bold">Up to 3</td>
                  <td className="p-6 text-center bg-green/30 text-green font-bold">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-6 text-c700 font-medium">Standard Listing Visibility</td>
                  <td className="p-6 text-center"><CheckCircle2 className="w-5 h-5 text-green mx-auto" /></td>
                  <td className="p-6 text-center bg-green/30"><CheckCircle2 className="w-5 h-5 text-green mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-6 text-c700 font-medium">Company Profile Page</td>
                  <td className="p-6 text-center"><CheckCircle2 className="w-5 h-5 text-green mx-auto" /></td>
                  <td className="p-6 text-center bg-green/30"><CheckCircle2 className="w-5 h-5 text-green mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-6 text-c700 font-medium">Featured Status (Top of search)</td>
                  <td className="p-6 text-center text-c400">—</td>
                  <td className="p-6 text-center bg-green/30"><CheckCircle2 className="w-5 h-5 text-green mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-6 text-c700 font-medium">Urgent Hiring Badge</td>
                  <td className="p-6 text-center text-c400">—</td>
                  <td className="p-6 text-center bg-green/30"><CheckCircle2 className="w-5 h-5 text-green mx-auto" /></td>
                </tr>
              </tbody>
            </table>
            
            <div className="bg-c100 p-8 border-t border-c200 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="font-bold text-c900 text-lg mb-1">Ready to hire?</h4>
                <p className="text-c500 text-sm">Join hundreds of companies hiring on Tutaly today.</p>
              </div>
              <Link 
                href="/auth/signup?role=employer" 
                className="bg-navy hover:bg-opacity-90 text-white px-8 py-3 rounded-xl font-bold transition-colors w-full sm:w-auto text-center"
              >
                Get Started for Free
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
