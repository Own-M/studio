"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Advisor, Lead, LeadStatus, Note, HistoryItem, LeadScore, CallOutcome } from "@/lib/types";
import { mockAdvisors, mockLeads, mockUnassignedLeads } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { scoreLead } from "@/ai/flows/score-lead-flow";

interface AppContextType {
  advisors: Advisor[];
  leads: Lead[];
  assignLead: (leadId: string, advisorId: string) => void;
  updateLeadStatus: (leadId: string, status: LeadStatus, outcome?: CallOutcome) => void;
  importLeads: (csvData: string) => void;
  addNoteToLead: (leadId: string, noteText: string) => void;
  addAdvisor: (name: string, email: string, password?: string) => void;
  deleteAdvisor: (advisorId: string) => void;
  getLeadById: (leadId: string) => Lead | undefined;
  getAdvisorById: (advisorId: string) => Advisor | undefined;
  updateLeadScore: (leadId: string) => Promise<void>;
  loginAdvisor: (email: string, password?: string) => Advisor | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [advisors, setAdvisors] = useState<Advisor[]>(mockAdvisors);
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const { toast } = useToast();

  const getLeadById = (leadId: string) => {
    return leads.find(lead => lead.id === leadId);
  }

  const getAdvisorById = (advisorId: string) => {
      return advisors.find(a => a.id === advisorId);
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

  const updateLeadStatus = (leadId: string, status: LeadStatus, outcome?: CallOutcome) => {
    const lead = getLeadById(leadId);
    if (!lead || lead.status === status) return;

    const oldStatus = lead.status;

    setLeads((prevLeads) =>
      prevLeads.map((l) => {
        if (l.id === leadId) {
            const updatedLead = { ...l, status };
            if (status === 'Contacted') {
                updatedLead.lastContacted = new Date().toISOString();
                if (outcome) {
                  updatedLead.lastCallOutcome = outcome;
                }
            }
            return updatedLead;
        }
        return l;
      })
    );
    
    let historyText = `Status changed from ${oldStatus} to ${status}.`;
    if(status === 'Contacted' && outcome) {
        historyText += ` Call Outcome: ${outcome}.`;
    }

    addHistoryItem(leadId, {
        type: 'STATUS_CHANGE',
        text: historyText,
        oldValue: oldStatus,
        newValue: status,
    });
  };
  
  const importLeads = (csvData: string) => {
    // In a real app, you'd parse the CSV properly.
    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const nameIndex = headers.indexOf('name');
    const phoneIndex = headers.indexOf('phone');

    if (nameIndex === -1 || phoneIndex === -1) {
        toast({
            variant: "destructive",
            title: "Import Failed",
            description: "CSV must contain 'name' and 'phone' columns.",
        });
        return;
    }

    const newLeads: Lead[] = lines.slice(1).map((line, index) => {
        const values = line.split(',');
        const name = values[nameIndex]?.trim();
        const phone = values[phoneIndex]?.trim();
        
        if (!name || !phone) return null;

        const creationHistory: HistoryItem = {
            id: `hist-import-${Date.now()}-${index}`,
            type: 'CREATION',
            text: `Lead "${name}" was created via CSV import.`,
            date: new Date().toISOString(),
        };

        return {
            id: `lead-import-${Date.now()}-${index}`,
            name,
            phone,
            email: `${name.toLowerCase().replace(/\s/g, '.')}@example.com`,
            status: "To Do",
            advisorId: null,
            notes: [],
            history: [creationHistory],
            score: null,
            lastContacted: null,
            lastCallOutcome: null,
        };
    }).filter((lead): lead is Lead => lead !== null);

    if (newLeads.length > 0) {
        setLeads(prev => [...prev, ...newLeads]);
        toast({
            title: "Import Successful",
            description: `${newLeads.length} new leads have been imported.`
        });
    } else {
        toast({
            variant: "destructive",
            title: "Import Failed",
            description: "No valid leads found in the CSV file.",
        });
    }
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

  const addAdvisor = (name: string, email: string, password?: string) => {
    const newAdvisor: Advisor = {
        id: `adv-${Date.now()}`,
        name,
        email,
        password,
    };
    setAdvisors(prev => [...prev, newAdvisor]);
    toast({
        title: "Advisor Added",
        description: `${name} has been added to the team.`
    })
  };

   const deleteAdvisor = (advisorId: string) => {
    const advisorToDelete = advisors.find(a => a.id === advisorId);
    if (!advisorToDelete) return;

    setAdvisors(prev => prev.filter(advisor => advisor.id !== advisorId));
    setLeads(prevLeads => prevLeads.map(lead => 
        lead.advisorId === advisorId ? { ...lead, advisorId: null } : lead
    ));

    toast({
        title: "Advisor Deleted",
        description: `${advisorToDelete.name} has been removed from the team.`,
        variant: "destructive",
    });
  };

  const updateLeadScore = async (leadId: string) => {
    const lead = getLeadById(leadId);
    if (!lead) return;

    // Prevent re-scoring immediately
    const lastHistory = lead.history[0];
    if(lastHistory?.type === 'SCORE_UPDATE' && (new Date().getTime() - new Date(lastHistory.date).getTime() < 60000)) {
        toast({ title: "Score Updated Recently", description: "Please wait a moment before re-scoring."});
        return;
    }

    try {
        const result = await scoreLead({ 
            name: lead.name, 
            status: lead.status,
            notes: lead.notes.map(n => n.text).join('\n'),
        });
        
        setLeads(prevLeads => prevLeads.map(l => 
            l.id === leadId ? { ...l, score: result.score as LeadScore } : l
        ));

        addHistoryItem(leadId, {
            type: 'SCORE_UPDATE',
            text: `AI score updated to ${result.score}. Reason: ${result.reason}`,
        });

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

  const loginAdvisor = (email: string, password?: string) => {
      const advisor = advisors.find(a => a.email.toLowerCase() === email.toLowerCase());
      if (advisor && advisor.password === password) {
          return advisor;
      }
      return undefined;
  }


  return (
    <AppContext.Provider value={{ advisors, leads, assignLead, updateLeadStatus, importLeads, addNoteToLead, addAdvisor, deleteAdvisor, getLeadById, getAdvisorById, updateLeadScore, loginAdvisor }}>
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
