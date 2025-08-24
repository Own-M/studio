"use client";

import { useState } from 'react';
import { useAppContext } from "@/context/app-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { FileUp, UserPlus } from 'lucide-react';

export default function LeadAssignment() {
    const { leads, advisors, assignLead, importLeads } = useAppContext();
    const unassignedLeads = leads.filter(lead => lead.advisorId === null);
    const [selectedAdvisors, setSelectedAdvisors] = useState<Record<string, string>>({});

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
    
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Unassigned Leads</CardTitle>
                    <CardDescription>Import new leads and assign them to your advisors.</CardDescription>
                </div>
                <Button onClick={importLeads}>
                    <FileUp className="mr-2 h-4 w-4" />
                    Import from CSV
                </Button>
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
