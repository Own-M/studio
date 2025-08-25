import type { Advisor, Lead, HistoryItem, Note } from "@/lib/types";

export const mockAdvisors: Advisor[] = [
  { id: "adv1", name: "Anika Tasnim", email: "anika@example.com", password: "password123" },
  { id: "adv2", name: "Rahim Ahmed", email: "rahim@example.com", password: "password123" },
  { id: "adv3", name: "Fatima Khan", email: "fatima@example.com", password: "password123" },
];

const generateCreationHistory = (name: string): HistoryItem => ({
    id: `hist-${Date.now()}-${Math.random()}`,
    type: 'CREATION',
    text: `Lead "${name}" was created.`,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
});

export const mockUnassignedLeads: Lead[] = [
    { id: "lead5", name: "Abdullah Al Mamun", phone: "01600000005", email: "abdullah@example.com", status: "To Do", advisorId: null, notes: [], history: [generateCreationHistory("Abdullah Al Mamun")], score: null, lastContacted: null, lastCallOutcome: null },
    { id: "lead6", name: "Ishrat Jahan", phone: "01300000006", email: "ishrat@example.com", status: "To Do", advisorId: null, notes: [], history: [generateCreationHistory("Ishrat Jahan")], score: 'Warm', lastContacted: null, lastCallOutcome: null },
    { id: "lead7", name: "Raihan Uddin", phone: "01400000007", email: "raihan@example.com", status: "To Do", advisorId: null, notes: [], history: [generateCreationHistory("Raihan Uddin")], score: null, lastContacted: null, lastCallOutcome: null },
];

const lead1Notes: Note[] = [];
const lead1History: HistoryItem[] = [generateCreationHistory("Jahid Hasan")];
const lead2Notes: Note[] = [{ id: "note1", text: "Called, but no answer. Will try again tomorrow.", date: new Date().toISOString() }];
const lead2History: HistoryItem[] = [generateCreationHistory("Sumaiya Akter"), { id: 'hist-note1', type: 'NOTE', text: 'Note added: Called, but no answer. Will try again tomorrow.', date: new Date().toISOString() }];
const lead3Notes: Note[] = [{ id: "note2", text: "Spoke with him. Interested in the product, asked for a brochure.", date: new Date().toISOString() }];
const lead3History: HistoryItem[] = [generateCreationHistory("Karim Chowdhury"), {id: 'hist-l3-1', type: 'STATUS_CHANGE', text: 'Status changed to Contacted', oldValue: 'To Do', newValue: 'Contacted', date: new Date().toISOString()}];
const lead4Notes: Note[] = [
    { id: "note3", text: "Initial contact made, seemed interested.", date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: "note4", text: "Followed up with brochure. Scheduled a demo for Friday.", date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { id: "note5", text: "Demo was successful. Converted to customer!", date: new Date().toISOString() }
];
const lead4History: HistoryItem[] = [
    generateCreationHistory("Nasrin Sultana"),
    { id: 'hist-l4-1', type: 'STATUS_CHANGE', text: 'Status changed to Contacted', oldValue: 'To Do', newValue: 'Contacted', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()},
    { id: 'hist-l4-2', type: 'NOTE', text: 'Note added: Initial contact made, seemed interested.', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()},
    { id: 'hist-l4-3', type: 'NOTE', text: 'Note added: Followed up with brochure. Scheduled a demo for Friday.', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()},
    { id: 'hist-l4-4', type: 'STATUS_CHANGE', text: 'Status changed to Converted', oldValue: 'Contacted', newValue: 'Converted', date: new Date().toISOString()},
    { id: 'hist-l4-5', text: 'Note added: Demo was successful. Converted to customer!', type: 'NOTE', date: new Date().toISOString() }
]


export const mockLeads: Lead[] = [
  { id: "lead1", name: "Jahid Hasan", phone: "01700000001", email: "jahid@example.com", status: "To Do", advisorId: "adv1", notes: lead1Notes, history: lead1History, score: "Hot", lastContacted: null, lastCallOutcome: null },
  { id: "lead2", name: "Sumaiya Akter", phone: "01800000002", email: "sumaiya@example.com", status: "To Do", advisorId: "adv1", notes: lead2Notes, history: lead2History, score: "Warm", lastContacted: null, lastCallOutcome: null },
  { id: "lead3", name: "Karim Chowdhury", phone: "01900000003", email: "karim@example.com", status: "Contacted", advisorId: "adv2", notes: lead3Notes, history: lead3History, score: "Hot", lastContacted: new Date().toISOString(), lastCallOutcome: "Call Received" },
  { id: "lead4", name: "Nasrin Sultana", phone: "01500000004", email: "nasrin@example.com", status: "Converted", advisorId: "adv2", notes: lead4Notes, history: lead4History, score: "Hot", lastContacted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), lastCallOutcome: "Call Received" },
  { id: "lead8", name: "Faria Islam", phone: "01711111111", email: "faria@example.com", status: "Contacted", advisorId: "adv1", notes: [], history: [generateCreationHistory("Faria Islam")], score: 'Cold', lastContacted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), lastCallOutcome: "Call Not Received" },
  { id: "lead9", name: "Imran Hossain", phone: "01822222222", email: "imran@example.com", status: "To Do", advisorId: "adv3", notes: [], history: [generateCreationHistory("Imran Hossain")], score: 'Warm', lastContacted: null, lastCallOutcome: null },
  ...mockUnassignedLeads,
];
