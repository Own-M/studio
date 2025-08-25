"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppContext } from "@/context/app-context";
import type { CallOutcome } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

interface CallUpdateDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  leadId: string;
}

const formSchema = z.object({
  outcome: z.enum(["Call Received", "Call Not Received", "Follow-up Required"], {
    required_error: "You must select a call outcome.",
  }),
  note: z.string().optional(),
});

export function CallUpdateDialog({ isOpen, onOpenChange, leadId }: CallUpdateDialogProps) {
  const { updateLeadStatus, addNoteToLead, getLeadById } = useAppContext();
  const lead = getLeadById(leadId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Update status to "Contacted" and log the outcome
    updateLeadStatus(leadId, "Contacted", values.outcome as CallOutcome);
    
    // Add a note if provided
    if (values.note && values.note.trim()) {
        addNoteToLead(leadId, `Outcome: ${values.outcome}. Note: ${values.note}`);
    }

    form.reset();
    onOpenChange(false);
  };
  
  // Reset form when dialog is closed
  const handleOpenChange = (open: boolean) => {
    if (!open) {
        form.reset();
    }
    onOpenChange(open);
  }

  if (!lead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Call Status for {lead.name}</DialogTitle>
          <DialogDescription>
            Log the outcome of your recent interaction with the lead. This will move the lead to the 'Contacted' column.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="outcome"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Call Outcome</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Call Received" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Call Received & Spoke to Lead
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Call Not Received" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Call Not Received / No Answer
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Follow-up Required" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Follow-up Required (e.g., call back later)
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Add a Note (Optional)</FormLabel>
                    <FormControl>
                        <Textarea placeholder="e.g. Client asked to call back tomorrow at 4 PM." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <DialogFooter>
                    <Button type="submit">Update Status</Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
