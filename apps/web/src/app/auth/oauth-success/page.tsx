'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function OAuthSuccess() {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleSuccess = async () => {
      try {
        // Because the backend sets an HttpOnly cookie containing the refreshToken,
        // we call the /auth/refresh endpoint to get a fresh access token and user object.
        const response = await api.post('/auth/refresh');
        
        localStorage.setItem('access_token', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        if (!response.data.user.isOnboardingComplete) {
          router.push('/auth/onboarding');
        } else {
          router.push('/dashboard');
        }
      } catch (err) {
        console.error('Failed to handle OAuth success:', err);
        setError('Authentication failed. Please try again.');
        setTimeout(() => router.push('/auth/signin'), 3000);
      }
    };

    handleSuccess();
  }, [router]);

  return (
    <div className="auth-shell" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' }}>
      <div className="auth-form-wrap" style={{ textAlign: 'center' }}>
        {error ? (
          <div className="field-error">{error}</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--navy)' }} />
            <h2 className="auth-heading" style={{ margin: 0 }}>Authenticating...</h2>
            <p className="auth-subheading">Please wait while we log you in.</p>
          </div>
        )}
      </div>
    </div>
  );
}
