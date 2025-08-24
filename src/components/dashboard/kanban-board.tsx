"use client";

import type { Lead } from "@/lib/types";
import KanbanColumn from "./kanban-column";

interface KanbanBoardProps {
  leads: Lead[];
}

export default function KanbanBoard({ leads }: KanbanBoardProps) {
  const todoLeads = leads.filter((lead) => lead.status === "To Do");
  const contactedLeads = leads.filter((lead) => lead.status === "Contacted");
  const convertedLeads = leads.filter((lead) => lead.status === "Converted");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <KanbanColumn title="To Do" leads={todoLeads} count={todoLeads.length} />
      <KanbanColumn title="Contacted" leads={contactedLeads} count={contactedLeads.length} />
      <KanbanColumn title="Converted" leads={convertedLeads} count={convertedLeads.length} />
    </div>
  );
}
