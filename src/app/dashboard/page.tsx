"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Role } from '@/lib/types';
import TeamLeaderDashboard from '@/components/dashboard/team-leader-dashboard';
import AdvisorDashboard from '@/components/dashboard/advisor-dashboard';
import { Header } from '@/components/header';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userRole = localStorage.getItem('userRole') as Role | null;
    if (!userRole) {
      router.push('/');
    } else {
      setRole(userRole);
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
        <div className="flex flex-col h-screen">
            <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-10 w-24" />
            </header>
            <main className="flex-1 p-4 md:p-8">
                <Skeleton className="h-full w-full rounded-lg" />
            </main>
        </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {role === 'team-leader' && <TeamLeaderDashboard />}
        {role === 'advisor' && <AdvisorDashboard />}
      </main>
    </div>
  );
}
