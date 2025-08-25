"use client";

import { useState, useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Lead, HistoryItem } from "@/lib/types";
import { useAppContext } from "@/context/app-context";
import { format, formatDistanceToNow } from "date-fns";
import { Separator } from "../ui/separator";
import { Clock, Tag, StickyNote, UserPlus, FileUp, Zap } from "lucide-react";
import { Badge } from "../ui/badge";

interface LeadDetailsSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  leadId: string;
}

export function LeadDetailsSheet({
  isOpen,
  onOpenChange,
  leadId,
}: LeadDetailsSheetProps) {
  const { getLeadById, addNoteToLead, updateLeadScore } = useAppContext();
  const [newNote, setNewNote] = useState("");
  const lead = useMemo(() => getLeadById(leadId), [leadId, getLeadById]);


  if (!lead) return null;

  const handleAddNote = () => {
    if (newNote.trim()) {
      addNoteToLead(lead.id, newNote);
      setNewNote("");
    }
  };

  const getHistoryIcon = (item: HistoryItem) => {
    switch (item.type) {
      case 'STATUS_CHANGE': return <Tag className="h-4 w-4 text-primary" />;
      case 'NOTE': return <StickyNote className="h-4 w-4 text-yellow-500" />;
      case 'ASSIGNMENT': return <UserPlus className="h-4 w-4 text-green-500" />;
      case 'CREATION': return <FileUp className="h-4 w-4 text-blue-500" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  }

  const getScoreVariant = (score: string | null) => {
    switch (score) {
      case 'Hot': return 'destructive';
      case 'Warm': return 'default';
      case 'Cold': return 'secondary';
      default: return 'outline';
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <div className="flex justify-between items-center">
            <SheetTitle>{lead.name}</SheetTitle>
            <div className="flex items-center gap-2">
                <Badge variant={getScoreVariant(lead.score)} className="text-sm">
                    {lead.score || "No Score"}
                </Badge>
                <Button variant="ghost" size="icon" onClick={() => updateLeadScore(lead.id)}>
                    <Zap className="h-5 w-5 text-primary" />
                    <span className="sr-only">Update Score</span>
                </Button>
            </div>
          </div>
          <SheetDescription>
            {lead.phone} - <span className="font-semibold">{lead.status}</span>
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <div className="flex-grow overflow-y-auto pr-4 -mr-4 space-y-4">
            <h3 className="text-lg font-semibold mt-4">History</h3>
            <div className="space-y-4">
                {lead.history.map((item) => (
                    <div key={item.id} className="flex items-start gap-4">
                        <div className="mt-1">{getHistoryIcon(item)}</div>
                        <div className="text-sm">
                           <p className="text-foreground">{item.text}</p>
                           <p className="text-xs text-muted-foreground mt-1">
                                {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
                           </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <SheetFooter className="mt-auto pt-4 border-t">
          <div className="w-full space-y-2">
            <Textarea
              placeholder="Add a new note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={3}
            />
            <Button onClick={handleAddNote} disabled={!newNote.trim()} className="w-full">
              Add Note
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
