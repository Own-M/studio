import type { Advisor, Lead } from "@/lib/types";

export const mockAdvisors: Advisor[] = [
  { id: "adv1", name: "Anika Tasnim", email: "anika@example.com" },
  { id: "adv2", name: "Rahim Ahmed", email: "rahim@example.com" },
  { id: "adv3", name: "Fatima Khan", email: "fatima@example.com" },
];

export const mockUnassignedLeads: Lead[] = [
    { id: "lead5", name: "Abdullah Al Mamun", phone: "01600000005", status: "To Do", advisorId: null, notes: [] },
    { id: "lead6", name: "Ishrat Jahan", phone: "01300000006", status: "To Do", advisorId: null, notes: [] },
    { id: "lead7", name: "Raihan Uddin", phone: "01400000007", status: "To Do", advisorId: null, notes: [] },
];

export const mockLeads: Lead[] = [
  { id: "lead1", name: "Jahid Hasan", phone: "01700000001", status: "To Do", advisorId: "adv1", notes: [] },
  { id: "lead2", name: "Sumaiya Akter", phone: "01800000002", status: "To Do", advisorId: "adv1", notes: [
    { id: "note1", text: "Called, but no answer. Will try again tomorrow.", date: new Date().toISOString() }
  ] },
  { id: "lead3", name: "Karim Chowdhury", phone: "01900000003", status: "Contacted", advisorId: "adv2", notes: [
    { id: "note2", text: "Spoke with him. Interested in the product, asked for a brochure.", date: new Date().toISOString() }
  ] },
  { id: "lead4", name: "Nasrin Sultana", phone: "01500000004", status: "Converted", advisorId: "adv2", notes: [
     { id: "note3", text: "Initial contact made, seemed interested.", date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
     { id: "note4", text: "Followed up with brochure. Scheduled a demo for Friday.", date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
     { id: "note5", text: "Demo was successful. Converted to customer!", date: new Date().toISOString() }
  ] },
  { id: "lead8", name: "Faria Islam", phone: "01711111111", status: "Contacted", advisorId: "adv1", notes: [] },
  { id: "lead9", name: "Imran Hossain", phone: "01822222222", status: "To Do", advisorId: "adv3", notes: [] },
  ...mockUnassignedLeads,
];
