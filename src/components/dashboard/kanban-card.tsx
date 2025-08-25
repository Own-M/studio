"use client";

import type { Lead } from "@/lib/types";
import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Phone, MessageCircle, CheckCircle, Sparkles, Notebook, Zap, Flame, Thermometer, Snowflake } from "lucide-react";
import { useAppContext } from "@/context/app-context";
import { ScriptGeneratorDialog } from "./script-generator-dialog";
import { LeadDetailsSheet } from "./lead-details-sheet";
import { useState, useEffect } from "react";
import { Badge } from "../ui/badge";

interface KanbanCardProps {
  lead: Lead;
}

export default function KanbanCard({ lead }: KanbanCardProps) {
  const { updateLeadStatus, updateLeadScore } = useAppContext();
  const [isScriptDialogOpen, setIsScriptDialogOpen] = useState(false);
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);

  useEffect(() => {
    if (lead.score === null) {
      updateLeadScore(lead.id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lead.id, lead.score]);

  const handleContact = () => {
    updateLeadStatus(lead.id, "Contacted");
  };
  
  const handleConvert = () => {
    updateLeadStatus(lead.id, "Converted");
  };

  const getScoreVariant = (score: string | null) => {
    switch (score) {
      case 'Hot': return 'destructive';
      case 'Warm': return 'default';
      case 'Cold': return 'secondary';
      default: return 'outline';
    }
  }

  const getScoreIcon = (score: string | null) => {
    switch (score) {
        case 'Hot': return <Flame className="h-4 w-4" />;
        case 'Warm': return <Thermometer className="h-4 w-4" />;
        case 'Cold': return <Snowflake className="h-4 w-4" />;
        default: return <Zap className="h-4 w-4 animate-pulse" />;
    }
  }

  return (
    <>
    <Card className="bg-card shadow-sm hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-base font-semibold">{lead.name}</CardTitle>
                <CardDescription className="pt-1">{lead.phone}</CardDescription>
            </div>
             <div className="flex items-center gap-2">
                {lead.score ? (
                     <Badge variant={getScoreVariant(lead.score)} className="gap-1.5 pr-2.5 pl-2">
                        {getScoreIcon(lead.score)}
                        {lead.score}
                     </Badge>
                ) : (
                    <Badge variant="outline">
                        <Zap className="h-4 w-4 text-muted-foreground animate-pulse" />
                    </Badge>
                )}
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsDetailsSheetOpen(true)}>
                    <Notebook className="h-4 w-4" />
                    <span className="sr-only">View Details</span>
                </Button>
            </div>
        </div>
      </CardHeader>
       <CardFooter className="flex justify-between items-center">
        <div>
             <Button variant="ghost" size="sm" onClick={() => setIsScriptDialogOpen(true)}>
                <Sparkles className="mr-2 h-4 w-4 text-primary" />
                Script
            </Button>
        </div>
        <div className="flex justify-end gap-2">
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
                <Button size="sm" onClick={handleConvert} className="bg-green-600 hover:bg-green-700 text-white">
                    <CheckCircle className="mr-2 h-4 w-4"/> Mark as Converted
                </Button>
            )}
        </div>
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
        leadId={lead.id}
    />
    </>
  );
}
