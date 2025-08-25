export type Role = "team-leader" | "advisor";

export interface Advisor {
  id: string;
  name: string;
  email: string;
}

export type LeadStatus = "To Do" | "Contacted" | "Converted";

export interface Note {
    id: string;
    text: string;
    date: string;
}

export interface Lead {
  id:string;
  name: string;
  phone: string;
  status: LeadStatus;
  advisorId: string | null;
  notes: Note[];
}
