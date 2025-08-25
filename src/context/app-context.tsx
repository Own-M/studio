"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Advisor, Lead, LeadStatus, Note, HistoryItem, LeadScore } from "@/lib/types";
import { mockAdvisors, mockLeads, mockUnassignedLeads } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { scoreLead } from "@/ai/flows/score-lead-flow";

interface AppContextType {
  advisors: Advisor[];
  leads: Lead[];
  assignLead: (leadId: string, advisorId: string) => void;
  updateLeadStatus: (leadId: string, status: LeadStatus) => void;
  importLeads: () => void;
  addNoteToLead: (leadId: string, noteText: string) => void;
  addAdvisor: (name: string, email: string) => void;
  getLeadById: (leadId: string) => Lead | undefined;
  updateLeadScore: (leadId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [advisors, setAdvisors] = useState<Advisor[]>(mockAdvisors);
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const { toast } = useToast();

  const getLeadById = (leadId: string) => {
    return leads.find(lead => lead.id === leadId);
  }

  const addHistoryItem = (leadId: string, item: Omit<HistoryItem, 'id' | 'date'>): Lead => {
    let modifiedLead: Lead | undefined;
    setLeads(prevLeads =>
        prevLeads.map(lead => {
            if (lead.id === leadId) {
                const newHistoryItem: HistoryItem = {
                    ...item,
                    id: `hist-${Date.now()}`,
                    date: new Date().toISOString()
                };
                modifiedLead = { ...lead, history: [newHistoryItem, ...lead.history] };
                return modifiedLead;
            }
            return lead;
        })
    );
    return modifiedLead!;
  };


  const assignLead = (leadId: string, advisorId: string) => {
    const assignedLead = leads.find(l => l.id === leadId);
    const assignedAdvisor = advisors.find(a => a.id === advisorId);
    
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === leadId ? { ...lead, advisorId } : lead
      )
    );
    
    if (assignedLead && assignedAdvisor) {
        addHistoryItem(leadId, {
            type: 'ASSIGNMENT',
            text: `Lead assigned to ${assignedAdvisor.name}.`,
        });
        toast({
            title: "Lead Assigned",
            description: `${assignedLead.name} has been assigned to ${assignedAdvisor.name}.`
        });
    }
  };

  const updateLeadStatus = (leadId: string, status: LeadStatus) => {
    const lead = getLeadById(leadId);
    if (!lead || lead.status === status) return;

    const oldStatus = lead.status;

    setLeads((prevLeads) =>
      prevLeads.map((l) => {
        if (l.id === leadId) {
            const updatedLead = { ...l, status };
            if (status === 'Contacted' && !l.lastContacted) {
                updatedLead.lastContacted = new Date().toISOString();
            }
            return updatedLead;
        }
        return l;
      })
    );
    
    addHistoryItem(leadId, {
        type: 'STATUS_CHANGE',
        text: `Status changed from ${oldStatus} to ${status}.`,
        oldValue: oldStatus,
        newValue: status,
    });
  };
  
  const importLeads = () => {
    const newLeads = mockUnassignedLeads.map(l => ({...l, id: `${l.id}-${Date.now()}`}));
    setLeads(prev => [...prev, ...newLeads]);
    toast({
        title: "Import Successful",
        description: `${newLeads.length} new leads have been imported.`
    })
  };

  const addNoteToLead = (leadId: string, noteText: string) => {
    const newNote: Note = {
        id: `note-${Date.now()}`,
        text: noteText,
        date: new Date().toISOString()
    };
    
    setLeads(prevLeads => 
        prevLeads.map(lead => {
            if (lead.id === leadId) {
                return {
                    ...lead,
                    notes: [newNote, ...lead.notes]
                };
            }
            return lead;
        })
    );

    addHistoryItem(leadId, {
        type: 'NOTE',
        text: `Note added: "${noteText}"`,
    });
    
    toast({
        title: "Note Added",
        description: `A new note has been added for the lead.`
    })
  };

  const addAdvisor = (name: string, email: string) => {
    const newAdvisor: Advisor = {
        id: `adv-${Date.now()}`,
        name,
        email,
    };
    setAdvisors(prev => [...prev, newAdvisor]);
    toast({
        title: "Advisor Added",
        description: `${name} has been added to the team.`
    })
  };

  const updateLeadScore = async (leadId: string) => {
    const lead = getLeadById(leadId);
    if (!lead) return;

    try {
        const result = await scoreLead({ 
            name: lead.name, 
            status: lead.status,
            notes: lead.notes.map(n => n.text).join('\n'),
        });
        
        setLeads(prevLeads => prevLeads.map(l => 
            l.id === leadId ? { ...l, score: result.score as LeadScore } : l
        ));

        toast({
            title: "Lead Score Updated",
            description: `The score for ${lead.name} is now ${result.score}.`
        });
    } catch(error) {
        console.error("Failed to score lead:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to update lead score.",
        });
    }
  }


  return (
    <AppContext.Provider value={{ advisors, leads, assignLead, updateLeadStatus, importLeads, addNoteToLead, addAdvisor, getLeadById, updateLeadScore }}>
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
