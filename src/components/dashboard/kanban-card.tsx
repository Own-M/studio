"use client";

import type { Lead } from "@/lib/types";
import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Phone, MessageCircle, CheckCircle, Sparkles, Notebook } from "lucide-react";
import { useAppContext } from "@/context/app-context";
import { ScriptGeneratorDialog } from "./script-generator-dialog";
import { LeadDetailsSheet } from "./lead-details-sheet";
import { useState } from "react";

interface KanbanCardProps {
  lead: Lead;
}

export default function KanbanCard({ lead }: KanbanCardProps) {
  const { updateLeadStatus } = useAppContext();
  const [isScriptDialogOpen, setIsScriptDialogOpen] = useState(false);
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);

  const handleContact = () => {
    updateLeadStatus(lead.id, "Contacted");
  };
  
  const handleConvert = () => {
    updateLeadStatus(lead.id, "Converted");
  };

  return (
    <>
    <Card className="bg-background/80 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-base">{lead.name}</CardTitle>
                <CardDescription>{lead.phone}</CardDescription>
            </div>
            <div className="flex items-center">
                <Button variant="ghost" size="icon" onClick={() => setIsScriptDialogOpen(true)}>
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span className="sr-only">Generate Script</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsDetailsSheetOpen(true)}>
                    <Notebook className="h-5 w-5" />
                    <span className="sr-only">View Details</span>
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardFooter className="flex justify-end gap-2">
        {lead.status === 'To Do' && (
             <>
                <Button variant="outline" size="sm" asChild onClick={handleContact}>
                    <a href={`tel:${lead.phone}`} aria-label={`Call ${lead.name}`}>
                        <Phone className="mr-2 h-4 w-4"/> Call
                    </a>
                </Button>
                <Button variant="outline" size="sm" asChild onClick={handleContact}>
                    <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${lead.name}`}>
                        <MessageCircle className="mr-2 h-4 w-4"/> WhatsApp
                    </a>
                </Button>
             </>
        )}
        {lead.status === 'Contacted' && (
            <Button size="sm" onClick={handleConvert} className="bg-green-500 hover:bg-green-600 text-white">
                <CheckCircle className="mr-2 h-4 w-4"/> Mark as Converted
            </Button>
        )}
      </CardFooter>
    </Card>
    <ScriptGeneratorDialog 
        isOpen={isScriptDialogOpen} 
        onOpenChange={setIsScriptDialogOpen}
        lead={lead}
    />
    <LeadDetailsSheet
        isOpen={isDetailsSheetOpen}
        onOpenChange={setIsDetailsSheetOpen}
        lead={lead}
    />
    </>
  );
}
