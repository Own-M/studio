export type Role = "team-leader" | "advisor";

export interface Advisor {
  id: string;
  name: string;
  email: string;
}

export type LeadStatus = "To Do" | "Contacted" | "Converted";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  status: LeadStatus;
  advisorId: string | null;
}
