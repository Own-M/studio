"use client";

import { useState, useEffect } from 'react';
import { useAppContext } from "@/context/app-context";
import KanbanBoard from "./kanban-board";
import type { Lead } from "@/lib/types";
import { Skeleton } from '../ui/skeleton';

export default function AdvisorDashboard() {
  const { leads, advisors } = useAppContext();
  const [advisorLeads, setAdvisorLeads] = useState<Lead[]>([]);
  const [currentAdvisorName, setCurrentAdvisorName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const advisorId = localStorage.getItem("userId");
    if (advisorId) {
      const currentAdvisor = advisors.find(a => a.id === advisorId);
      setCurrentAdvisorName(currentAdvisor?.name || 'Advisor');
      const filteredLeads = leads.filter(lead => lead.advisorId === advisorId);
      setAdvisorLeads(filteredLeads);
    }
    setLoading(false);
  }, [leads, advisors]);

  if (loading) {
      return <Skeleton className="w-full h-[600px]" />
  }

  return (
    <div className='space-y-4'>
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Welcome, {currentAdvisorName}</h1>
            <p className="text-muted-foreground">You have {advisorLeads.length} total leads.</p>
        </div>
      <KanbanBoard leads={advisorLeads} />
    </div>
  );
}
