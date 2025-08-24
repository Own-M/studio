"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { generateScript } from "@/ai/flows/generate-script-flow";
import type { Lead } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Loader, Sparkles, Copy } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

interface ScriptGeneratorDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    lead: Lead;
}

export function ScriptGeneratorDialog({ isOpen, onOpenChange, lead }: ScriptGeneratorDialogProps) {
    const [script, setScript] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleGenerateScript = async () => {
        setIsLoading(true);
        setScript("");
        try {
            const result = await generateScript({ name: lead.name, phone: lead.phone });
            setScript(result.script);
        } catch (error) {
            console.error("Failed to generate script:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to generate script. Please try again.",
            });
        }
        setIsLoading(false);
    }
    
    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(script);
        toast({
            title: "Copied!",
            description: "The script has been copied to your clipboard.",
        })
    }

    // Reset state when dialog is closed
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setScript("");
            setIsLoading(false);
        }
        onOpenChange(open);
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>AI Sales Script Generator</DialogTitle>
                    <DialogDescription>
                        Generate a personalized sales script for <strong>{lead.name}</strong>.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {isLoading ? (
                         <div className="space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-1/2" />
                         </div>
                    ) : script ? (
                        <div className="relative">
                           <Textarea value={script} readOnly rows={10} className="pr-10 bg-secondary/50"/>
                           <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={handleCopyToClipboard}>
                                <Copy className="h-4 w-4"/>
                           </Button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center text-center h-24 rounded-md bg-secondary/50">
                            <p className="text-sm text-muted-foreground">Click the button below to generate a script.</p>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={handleGenerateScript} disabled={isLoading}>
                         {isLoading ? <Loader className="mr-2 animate-spin" /> : <Sparkles className="mr-2" />}
                        {script ? "Regenerate" : "Generate Script"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
