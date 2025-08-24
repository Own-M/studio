import type { Advisor, Lead } from "@/lib/types";

export const mockAdvisors: Advisor[] = [
  { id: "adv1", name: "Anika Tasnim", email: "anika@example.com" },
  { id: "adv2", name: "Rahim Ahmed", email: "rahim@example.com" },
  { id: "adv3", name: "Fatima Khan", email: "fatima@example.com" },
];

export const mockUnassignedLeads: Lead[] = [
    { id: "lead5", name: "Abdullah Al Mamun", phone: "01600000005", status: "To Do", advisorId: null },
    { id: "lead6", name: "Ishrat Jahan", phone: "01300000006", status: "To Do", advisorId: null },
    { id: "lead7", name: "Raihan Uddin", phone: "01400000007", status: "To Do", advisorId: null },
];

export const mockLeads: Lead[] = [
  { id: "lead1", name: "Jahid Hasan", phone: "01700000001", status: "To Do", advisorId: "adv1" },
  { id: "lead2", name: "Sumaiya Akter", phone: "01800000002", status: "To Do", advisorId: "adv1" },
  { id: "lead3", name: "Karim Chowdhury", phone: "01900000003", status: "Contacted", advisorId: "adv2" },
  { id: "lead4", name: "Nasrin Sultana", phone: "01500000004", status: "Converted", advisorId: "adv2" },
  { id: "lead8", name: "Faria Islam", phone: "01711111111", status: "Contacted", advisorId: "adv1" },
  { id: "lead9", name: "Imran Hossain", phone: "01822222222", status: "To Do", advisorId: "adv3" },
  ...mockUnassignedLeads,
];
