"use client";

import { useState, useMemo } from 'react';
import { useAppContext } from "@/context/app-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '../ui/badge';
import type { LeadStatus, CallOutcome } from '@/lib/types';
import { Flame, Thermometer, Snowflake, Zap, PhoneMissed, Phone, Timer } from 'lucide-react';

export default function LeadDataCenter() {
    const { leads, advisors } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
    const [advisorFilter, setAdvisorFilter] = useState<string>('all');

    const filteredLeads = useMemo(() => {
        return leads
            .filter(lead => 
                (searchTerm === '' || lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || lead.phone.includes(searchTerm))
            )
            .filter(lead => 
                statusFilter === 'all' || lead.status === statusFilter
            )
            .filter(lead =>
                advisorFilter === 'all' || lead.advisorId === advisorFilter
            );
    }, [leads, searchTerm, statusFilter, advisorFilter]);

    const getScoreVariant = (score: string | null) => {
        switch (score) {
          case 'Hot': return 'destructive';
          case 'Warm': return 'default';
          case 'Cold': return 'secondary';
          default: return 'outline';
        }
    };

    const getScoreIcon = (score: string | null) => {
        switch (score) {
            case 'Hot': return <Flame className="h-4 w-4" />;
            case 'Warm': return <Thermometer className="h-4 w-4" />;
            case 'Cold': return <Snowflake className="h-4 w-4" />;
            default: return <Zap className="h-4 w-4" />;
        }
    };
    
    const getCallOutcomeIcon = (outcome: CallOutcome) => {
        switch(outcome) {
            case "Call Received": return <Phone className="h-4 w-4 text-green-500"/>;
            case "Call Not Received": return <PhoneMissed className="h-4 w-4 text-red-500"/>;
            case "Follow-up Required": return <Timer className="h-4 w-4 text-yellow-500"/>;
            default: return null;
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Lead Data Center</CardTitle>
                <CardDescription>View, search, and filter all leads in the system.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <Input 
                        placeholder="Search by name or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                    <Select onValueChange={(value) => setStatusFilter(value as any)} defaultValue="all">
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="To Do">To Do</SelectItem>
                            <SelectItem value="Contacted">Contacted</SelectItem>
                            <SelectItem value="Converted">Converted</SelectItem>
                        </SelectContent>
                    </Select>
                     <Select onValueChange={(value) => setAdvisorFilter(value)} defaultValue="all">
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by Advisor" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Advisors</SelectItem>
                            {advisors.map(adv => (
                                <SelectItem key={adv.id} value={adv.id}>{adv.name}</SelectItem>
                            ))}
                             <SelectItem value="null">Unassigned</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Client</TableHead>
                            <TableHead>Assigned To</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>AI Score</TableHead>
                            <TableHead>Last Contact</TableHead>
                            <TableHead>Call Outcome</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredLeads.length > 0 ? filteredLeads.map(lead => {
                            const advisor = lead.advisorId ? advisors.find(a => a.id === lead.advisorId) : null;
                            return (
                                <TableRow key={lead.id}>
                                    <TableCell>
                                        <div className="font-medium">{lead.name}</div>
                                        <div className="text-sm text-muted-foreground">{lead.phone}</div>
                                    </TableCell>
                                    <TableCell>{advisor ? advisor.name : <span className="text-muted-foreground italic">Unassigned</span>}</TableCell>
                                    <TableCell>
                                        <Badge variant={lead.status === 'Converted' ? 'default' : lead.status === 'Contacted' ? 'secondary' : 'outline'}>
                                            {lead.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getScoreVariant(lead.score)} className="gap-1.5 pl-2 pr-2.5">
                                            {getScoreIcon(lead.score)}
                                            {lead.score || 'N/A'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{lead.lastContacted ? formatDistanceToNow(new Date(lead.lastContacted), { addSuffix: true }) : 'N/A'}</TableCell>
                                    <TableCell>
                                        {lead.lastCallOutcome ? (
                                            <div className='flex items-center gap-2'>
                                                {getCallOutcomeIcon(lead.lastCallOutcome)}
                                                <span>{lead.lastCallOutcome}</span>
                                            </div>
                                        ) : 'N/A'}
                                    </TableCell>
                                </TableRow>
                            )
                        }) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24">
                                    No leads match the current filters.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
