"use client";

import { useState, useRef } from 'react';
import { useAppContext } from "@/context/app-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { FileUp, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LeadAssignment() {
    const { leads, advisors, assignLead, importLeads } = useAppContext();
    const unassignedLeads = leads.filter(lead => lead.advisorId === null);
    const [selectedAdvisors, setSelectedAdvisors] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleAssign = (leadId: string) => {
        const advisorId = selectedAdvisors[leadId];
        if(advisorId) {
            assignLead(leadId, advisorId);
            setSelectedAdvisors(prev => {
                const newState = {...prev};
                delete newState[leadId];
                return newState;
            });
        }
    };
    
    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result;
                if (typeof text === 'string') {
                    // In a real app, you would parse the CSV here.
                    // For now, we pass the raw text to a mock function.
                    importLeads(text);
                }
            };
            reader.readAsText(file);
            toast({
                title: "File Selected",
                description: `${file.name} is being processed.`,
            });
        }
         // Reset the file input so the same file can be re-uploaded
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Unassigned Leads</CardTitle>
                    <CardDescription>Import new leads and assign them to your advisors.</CardDescription>
                </div>
                <Button onClick={handleImportClick}>
                    <FileUp className="mr-2 h-4 w-4" />
                    Import from CSV
                </Button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".csv"
                    className="hidden"
                />
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Client Name</TableHead>
                            <TableHead>Phone Number</TableHead>
                            <TableHead className="w-[200px]">Assign To</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {unassignedLeads.length > 0 ? unassignedLeads.map(lead => (
                            <TableRow key={lead.id}>
                                <TableCell className="font-medium">{lead.name}</TableCell>
                                <TableCell>{lead.phone}</TableCell>
                                <TableCell>
                                    <Select onValueChange={(value) => setSelectedAdvisors(prev => ({ ...prev, [lead.id]: value }))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Advisor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {advisors.map(advisor => (
                                                <SelectItem key={advisor.id} value={advisor.id}>{advisor.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" onClick={() => handleAssign(lead.id)} disabled={!selectedAdvisors[lead.id]}>
                                        <UserPlus className="mr-2 h-4 w-4"/>
                                        Assign
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24">
                                    No unassigned leads. Try importing some!
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
