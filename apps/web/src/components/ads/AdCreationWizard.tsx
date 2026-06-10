"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Goal = 'business' | 'job' | 'product' | 'company' | '';
type Format = 'banner' | 'sponsored_job' | 'sponsored_product' | 'sidebar' | '';

export default function AdCreationWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'flutterwave' | 'paystack' | null>(null);

  const [formData, setFormData] = useState({
    goal: '' as Goal,
    format: '' as Format,
    targetUrl: '',
    placement: 'homepage_top',
    startsAt: '',
    endsAt: '',
    creativeFile: null as File | null,
    jobId: '',
    productId: '',
  });

  const handleNext = () => setStep((s) => Math.min(5, s + 1));
  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const calculateBudget = () => {
    // Simple mock calculation based on format and duration
    if (!formData.startsAt || !formData.endsAt) return 0;
    const start = new Date(formData.startsAt);
    const end = new Date(formData.endsAt);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
    
    let rate = 2000;
    if (formData.format === 'banner') rate = 5000;
    if (formData.format === 'sponsored_job') rate = 3000;
    if (formData.format === 'sponsored_product') rate = 2500;
    if (formData.format === 'sidebar') rate = 2000;

    return days * rate;
  };

  const handlePaymentAndSubmit = async () => {
    if (!paymentMethod) return alert('Please select a payment method');
    setIsSubmitting(true);

    try {
      // 1. Upload creative if exists
      let imageUrl = '';
      if (formData.creativeFile) {
        const uploadData = new FormData();
        uploadData.append('file', formData.creativeFile);
        
        const uploadRes = await fetch('/api/ads/campaigns/upload-creative', {
          method: 'POST',
          body: uploadData,
          headers: {
            // Note: Authorization headers handled globally or via NextAuth in real app
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          }
        });
        if (uploadRes.ok) {
          const uData = await uploadRes.json();
          imageUrl = uData.url;
        } else {
          // Mock URL for now if backend isn't fully ready
          imageUrl = 'https://tutaly.com/mock-ad.jpg';
        }
      }

      // 2. Create campaign
      const budget = calculateBudget();
      const res = await fetch('/api/ads/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          type: formData.format,
          target_url: formData.targetUrl,
          placement: formData.placement,
          starts_at: formData.startsAt,
          ends_at: formData.endsAt,
          budget,
          gateway: paymentMethod,
          image_url: imageUrl,
        }),
      });

      if (res.ok) {
        // Mock gateway redirect
        alert(`Redirecting to ${paymentMethod === 'flutterwave' ? 'Flutterwave' : 'Paystack'} to pay ₦${budget.toLocaleString()}...`);
        setTimeout(() => {
          router.push('/advertise/dashboard?success=true');
        }, 1500);
      } else {
        alert('Failed to create campaign. Please try again.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during submission.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">Create New Campaign</h1>
        <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-brand-blue transition-all duration-300" 
            style={{ width: `${(step / 5) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-400 mt-2">Step {step} of 5</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 min-h-[400px]">
        {/* STEP 1: GOAL */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-white">What is your advertising goal?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'business', icon: '🏢', title: 'Promote My Business', desc: 'Drive traffic to your website or landing page' },
                { id: 'job', icon: '💼', title: 'Promote a Job', desc: 'Get more qualified applicants for your open roles' },
                { id: 'product', icon: '🛍', title: 'Promote a Product', desc: 'Boost visibility of your marketplace listing' },
                { id: 'company', icon: '📣', title: 'Promote Company Page', desc: 'Build brand awareness among professionals' },
              ].map((g) => (
                <div 
                  key={g.id}
                  onClick={() => setFormData({ ...formData, goal: g.id as Goal })}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-colors ${
                    formData.goal === g.id 
                      ? 'border-brand-blue bg-brand-blue/10' 
                      : 'border-neutral-700 hover:border-neutral-500'
                  }`}
                >
                  <div className="text-3xl mb-3">{g.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-white">{g.title}</h3>
                  <p className="text-gray-400 text-sm">{g.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: FORMAT */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-white">Choose your ad format</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'banner', title: 'Banner Ad', desc: 'Full-width banner placed prominently', validGoals: ['business', 'company'] },
                { id: 'sidebar', title: 'Sidebar Ad', desc: 'Box ad on the right sidebar', validGoals: ['business', 'company'] },
                { id: 'sponsored_job', title: 'Sponsored Job', desc: 'Pin your job to the top of results', validGoals: ['job'] },
                { id: 'sponsored_product', title: 'Sponsored Product', desc: 'Highlight product in the shop', validGoals: ['product'] },
              ]
              .filter(f => !formData.goal || f.validGoals.includes(formData.goal))
              .map((f) => (
                <div 
                  key={f.id}
                  onClick={() => setFormData({ ...formData, format: f.id as Format })}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-colors ${
                    formData.format === f.id 
                      ? 'border-brand-blue bg-brand-blue/10' 
                      : 'border-neutral-700 hover:border-neutral-500'
                  }`}
                >
                  <h3 className="text-xl font-bold mb-2 text-white">{f.title}</h3>
                  <p className="text-gray-400 text-sm">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: CREATIVE */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-white">Ad Creative & Content</h2>
            
            {(formData.format === 'banner' || formData.format === 'sidebar') && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Upload Creative Image</label>
                  <div className="border-2 border-dashed border-neutral-700 rounded-xl p-10 text-center hover:bg-neutral-800 transition-colors">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setFormData({ ...formData, creativeFile: e.target.files?.[0] || null })}
                      className="hidden" 
                      id="file-upload" 
                    />
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                      <div className="text-4xl mb-3">📸</div>
                      <span className="text-brand-blue font-medium hover:underline">Click to upload</span>
                      <span className="text-sm text-gray-500 mt-1">PNG, JPG up to 2MB</span>
                      {formData.creativeFile && (
                        <div className="mt-4 text-brand-green text-sm font-mono bg-brand-green/10 px-3 py-1 rounded">
                          Selected: {formData.creativeFile.name}
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Destination URL</label>
                  <input 
                    type="url" 
                    placeholder="https://your-website.com"
                    value={formData.targetUrl}
                    onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>
            )}

            {formData.format === 'sponsored_job' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Select Active Job to Sponsor</label>
                  <select 
                    value={formData.jobId}
                    onChange={(e) => setFormData({ ...formData, jobId: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue"
                  >
                    <option value="">-- Choose a Job --</option>
                    <option value="job1">Senior Frontend Engineer (Lagos)</option>
                    <option value="job2">Marketing Manager (Remote)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: TARGETING & SCHEDULE */}
        {step === 4 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-white">Targeting & Schedule</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Placement (Where it appears)</label>
                <select 
                  value={formData.placement}
                  onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue"
                >
                  <option value="homepage_top">Homepage Top</option>
                  <option value="jobs_sidebar">Jobs Page Sidebar</option>
                  <option value="shop_top">Shop Top Banner</option>
                  <option value="connect_sidebar">Connect Feed Sidebar</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                  <input 
                    type="date" 
                    value={formData.startsAt}
                    onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                  <input 
                    type="date" 
                    value={formData.endsAt}
                    onChange={(e) => setFormData({ ...formData, endsAt: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW & PAYMENT */}
        {step === 5 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-white">Review & Payment</h2>
            
            <div className="bg-neutral-800 rounded-xl p-6 mb-8 border border-neutral-700">
              <h3 className="font-bold text-lg mb-4 border-b border-neutral-700 pb-2">Campaign Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Goal:</span>
                  <span className="font-medium text-white uppercase">{formData.goal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Format:</span>
                  <span className="font-medium text-white uppercase">{formData.format.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Placement:</span>
                  <span className="font-medium text-white">{formData.placement.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration:</span>
                  <span className="font-medium text-white">{formData.startsAt} to {formData.endsAt}</span>
                </div>
                <div className="pt-3 mt-3 border-t border-neutral-700 flex justify-between items-center">
                  <span className="font-bold text-white text-lg">Total Budget:</span>
                  <span className="font-bold text-brand-gold font-mono text-2xl">₦{calculateBudget().toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <label className="block text-sm font-medium text-gray-300 mb-2">Select Payment Gateway</label>
              <div 
                onClick={() => setPaymentMethod('flutterwave')}
                className={`p-4 border-2 rounded-xl cursor-pointer flex items-center justify-between transition-colors ${paymentMethod === 'flutterwave' ? 'border-brand-blue bg-brand-blue/10' : 'border-neutral-700'}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-brand-gold flex items-center justify-center text-black text-xs font-bold">F</div>
                  <span className="font-bold text-white">Flutterwave</span>
                </div>
                {paymentMethod === 'flutterwave' && <span className="text-brand-blue">✓</span>}
              </div>

              <div 
                onClick={() => setPaymentMethod('paystack')}
                className={`p-4 border-2 rounded-xl cursor-pointer flex items-center justify-between transition-colors ${paymentMethod === 'paystack' ? 'border-brand-blue bg-brand-blue/10' : 'border-neutral-700'}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-[#00C3F7] flex items-center justify-center text-white text-xs font-bold">P</div>
                  <span className="font-bold text-white">Paystack</span>
                </div>
                {paymentMethod === 'paystack' && <span className="text-brand-blue">✓</span>}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-neutral-800">
        <button 
          onClick={step === 1 ? () => router.back() : handleBack}
          className="px-6 py-2 text-gray-400 font-medium hover:text-white transition-colors"
          disabled={isSubmitting}
        >
          {step === 1 ? 'Cancel' : '&larr; Back'}
        </button>
        
        {step < 5 ? (
          <button 
            onClick={handleNext}
            disabled={
              (step === 1 && !formData.goal) || 
              (step === 2 && !formData.format)
            }
            className="px-8 py-3 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Continue
          </button>
        ) : (
          <button 
            onClick={handlePaymentAndSubmit}
            disabled={isSubmitting || !paymentMethod || calculateBudget() <= 0}
            className="px-8 py-3 bg-brand-green text-white font-bold rounded-lg hover:bg-brand-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isSubmitting ? 'Processing...' : `Pay ₦${calculateBudget().toLocaleString()} & Launch`}
          </button>
        )}
      </div>
    </div>
  );
}
