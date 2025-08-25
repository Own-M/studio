"use client";

import type { Lead } from "@/lib/types";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import KanbanCard from "./kanban-card";
import { Badge } from "../ui/badge";

interface KanbanColumnProps {
  title: string;
  leads: Lead[];
  count: number;
}

export default function KanbanColumn({ title, leads, count }: KanbanColumnProps) {
  
  const getBorderColor = (title: string) => {
    switch (title) {
        case 'To Do': return 'border-t-yellow-500';
        case 'Contacted': return 'border-t-blue-500';
        case 'Converted': return 'border-t-green-500';
        default: return 'border-t-gray-300';
    }
  }

  return (
    <div className="flex flex-col h-full bg-secondary/50 rounded-lg shadow-sm">
      <CardHeader className={`flex-shrink-0 border-t-4 ${getBorderColor(title)} rounded-t-lg bg-card sticky top-0 z-10`}>
        <CardTitle className="flex items-center justify-between text-lg font-bold">
            <span>{title}</span>
            <Badge variant="secondary" className="text-base">{count}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-4 overflow-y-auto p-4">
        {leads.length > 0 ? (
          leads.map((lead) => <KanbanCard key={lead.id} lead={lead} />)
        ) : (
          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground bg-card/50 rounded-md">
            No leads here.
          </div>
        )}
      </CardContent>
    </div>
  );
}
