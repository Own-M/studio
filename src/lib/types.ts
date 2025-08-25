export type Role = "team-leader" | "advisor";

export interface Advisor {
  id: string;
  name: string;
  email: string;
}

export type LeadStatus = "To Do" | "Contacted" | "Converted";
export type LeadScore = "Hot" | "Warm" | "Cold" | null;

export interface HistoryItem {
    id: string;
    type: 'STATUS_CHANGE' | 'NOTE' | 'ASSIGNMENT' | 'CREATION';
    text: string;
    date: string;
    oldValue?: string;
    newValue?: string;
}

export interface Note {
    id: string;
    text: string;
    date: string;
}

export interface Lead {
  id:string;
  name: string;
  phone: string;
  email?: string;
  status: LeadStatus;
  advisorId: string | null;
  notes: Note[];
  history: HistoryItem[];
  score: LeadScore;
  lastContacted: string | null;
}
