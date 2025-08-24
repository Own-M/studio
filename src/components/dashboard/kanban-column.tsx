"use client";

import type { Lead } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import KanbanCard from "./kanban-card";
import { Badge } from "../ui/badge";

interface KanbanColumnProps {
  title: string;
  leads: Lead[];
  count: number;
}

export default function KanbanColumn({ title, leads, count }: KanbanColumnProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center justify-between">
            <span>{title}</span>
            <Badge variant="secondary">{count}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-4 overflow-y-auto">
        {leads.length > 0 ? (
          leads.map((lead) => <KanbanCard key={lead.id} lead={lead} />)
        ) : (
          <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">
            No leads here.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
