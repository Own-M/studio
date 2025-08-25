"use client";

import { useState } from "react";
import { useAppContext } from "@/context/app-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { User, UserPlus } from "lucide-react";
import { Button } from "../ui/button";
import { AddAdvisorDialog } from "./add-advisor-dialog";

export default function AdvisorList() {
    const { advisors } = useAppContext();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Registered Advisors</CardTitle>
                    <CardDescription>A list of all advisors in your team.</CardDescription>
                </div>
                <Button onClick={() => setIsDialogOpen(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Advisor
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Advisor</TableHead>
                            <TableHead>Email</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {advisors.map(advisor => (
                            <TableRow key={advisor.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarFallback>
                                                {advisor.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{advisor.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{advisor.email}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        <AddAdvisorDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
        </>
    )
}
