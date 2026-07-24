'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Define route prefixes where the public Navbar and Footer should be hidden
  const hideNavigationPaths = [
    '/dashboard',
    '/admin',
    '/employer',
    '/seeker',
    '/seller',
    '/auth'
  ];

  const shouldHideNavigation = hideNavigationPaths.some(path => pathname?.startsWith(path));

  return (
    <>
      {!shouldHideNavigation && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!shouldHideNavigation && <Footer />}
    </>
  );
}
