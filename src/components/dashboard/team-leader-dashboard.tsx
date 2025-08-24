"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdvisorList from "./advisor-list";
import LeadAssignment from "./lead-assignment";
import AnalyticsDashboard from "./analytics-dashboard";
import { Users, ListChecks, BarChart } from "lucide-react";

export default function TeamLeaderDashboard() {
  return (
    <Tabs defaultValue="leads" className="w-full">
      <TabsList className="grid w-full grid-cols-3 md:w-[600px]">
        <TabsTrigger value="leads">
            <ListChecks className="mr-2 h-4 w-4" />
            Lead Assignment
        </TabsTrigger>
        <TabsTrigger value="advisors">
            <Users className="mr-2 h-4 w-4" />
            Advisors
        </TabsTrigger>
        <TabsTrigger value="analytics">
            <BarChart className="mr-2 h-4 w-4" />
            Analytics
        </TabsTrigger>
      </TabsList>
      <TabsContent value="leads">
        <LeadAssignment />
      </TabsContent>
      <TabsContent value="advisors">
        <AdvisorList />
      </TabsContent>
       <TabsContent value="analytics">
        <AnalyticsDashboard />
      </TabsContent>
    </Tabs>
  );
}
