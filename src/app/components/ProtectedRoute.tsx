'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '../APIServices/apiService';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!apiService.isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  // Show nothing while checking authentication
  if (!apiService.isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
}