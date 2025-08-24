"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Advisor, Lead, LeadStatus } from "@/lib/types";
import { mockAdvisors, mockLeads, mockUnassignedLeads } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

interface AppContextType {
  advisors: Advisor[];
  leads: Lead[];
  assignLead: (leadId: string, advisorId: string) => void;
  updateLeadStatus: (leadId: string, status: LeadStatus) => void;
  importLeads: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [advisors, setAdvisors] = useState<Advisor[]>(mockAdvisors);
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const { toast } = useToast();

  const assignLead = (leadId: string, advisorId: string) => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === leadId ? { ...lead, advisorId } : lead
      )
    );
    const assignedLead = leads.find(l => l.id === leadId);
    const assignedAdvisor = advisors.find(a => a.id === advisorId);
    toast({
        title: "Lead Assigned",
        description: `${assignedLead?.name} has been assigned to ${assignedAdvisor?.name}.`
    });
  };

  const updateLeadStatus = (leadId: string, status: LeadStatus) => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === leadId ? { ...lead, status } : lead
      )
    );
  };
  
  const importLeads = () => {
    // In a real app, this would parse a CSV. Here, we just add more mock leads.
    const newLeads = mockUnassignedLeads.map(l => ({...l, id: `${l.id}-${Date.now()}`})); // ensure unique ids
    setLeads(prev => [...prev, ...newLeads]);
    toast({
        title: "Import Successful",
        description: `${newLeads.length} new leads have been imported.`
    })
  }

  return (
    <AppContext.Provider value={{ advisors, leads, assignLead, updateLeadStatus, importLeads }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
