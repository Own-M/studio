"use client";

import type { Lead } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Phone, MessageCircle, CheckCircle } from "lucide-react";
import { useAppContext } from "@/context/app-context";

interface KanbanCardProps {
  lead: Lead;
}

export default function KanbanCard({ lead }: KanbanCardProps) {
  const { updateLeadStatus } = useAppContext();

  const handleContact = () => {
    updateLeadStatus(lead.id, "Contacted");
  };
  
  const handleConvert = () => {
    updateLeadStatus(lead.id, "Converted");
  };

  return (
    <Card className="bg-background/80 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-base">{lead.name}</CardTitle>
        <CardDescription>{lead.phone}</CardDescription>
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
  );
}
