"use client";

import { useState } from "react";
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
import type { Lead } from "@/lib/types";
import { useAppContext } from "@/context/app-context";
import { format } from "date-fns";
import { Separator } from "../ui/separator";

interface LeadDetailsSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  lead: Lead;
}

export function LeadDetailsSheet({
  isOpen,
  onOpenChange,
  lead,
}: LeadDetailsSheetProps) {
  const { addNoteToLead } = useAppContext();
  const [newNote, setNewNote] = useState("");

  const handleAddNote = () => {
    if (newNote.trim()) {
      addNoteToLead(lead.id, newNote);
      setNewNote("");
    }
  };

  const sortedNotes = [...lead.notes].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle>{lead.name}</SheetTitle>
          <SheetDescription>
            {lead.phone} - <span className="font-semibold">{lead.status}</span>
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <div className="flex-grow overflow-y-auto pr-4 -mr-4 space-y-4">
            <h3 className="text-lg font-semibold mt-4">Notes</h3>
            {sortedNotes.length > 0 ? (
                <div className="space-y-4">
                    {sortedNotes.map((note) => (
                        <div key={note.id} className="text-sm p-3 rounded-md bg-secondary/50">
                           <p className="text-foreground">{note.text}</p>
                           <p className="text-xs text-muted-foreground mt-1">{format(new Date(note.date), "PPP p")}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">
                    No notes yet.
                </div>
            )}
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
