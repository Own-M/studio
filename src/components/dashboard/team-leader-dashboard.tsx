"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdvisorList from "./advisor-list";
import LeadAssignment from "./lead-assignment";
import { Users, ListChecks } from "lucide-react";

export default function TeamLeaderDashboard() {
  return (
    <Tabs defaultValue="leads" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
        <TabsTrigger value="leads">
            <ListChecks className="mr-2 h-4 w-4" />
            Lead Assignment
        </TabsTrigger>
        <TabsTrigger value="advisors">
            <Users className="mr-2 h-4 w-4" />
            Advisors
        </TabsTrigger>
      </TabsList>
      <TabsContent value="leads">
        <LeadAssignment />
      </TabsContent>
      <TabsContent value="advisors">
        <AdvisorList />
      </TabsContent>
    </Tabs>
  );
}
