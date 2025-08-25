"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdvisorList from "./advisor-list";
import LeadAssignment from "./lead-assignment";
import AnalyticsDashboard from "./analytics-dashboard";
import { Users, ListChecks, BarChart, Bot } from "lucide-react";
import AiChat from "./ai-chat";

export default function TeamLeaderDashboard() {
  return (
    <Tabs defaultValue="analytics" className="w-full">
      <TabsList className="grid w-full grid-cols-4 md:w-[800px]">
        <TabsTrigger value="analytics">
            <BarChart className="mr-2 h-4 w-4" />
            Analytics
        </TabsTrigger>
        <TabsTrigger value="leads">
            <ListChecks className="mr-2 h-4 w-4" />
            Lead Assignment
        </TabsTrigger>
        <TabsTrigger value="advisors">
            <Users className="mr-2 h-4 w-4" />
            Advisors
        </TabsTrigger>
        <TabsTrigger value="ai-chat">
            <Bot className="mr-2 h-4 w-4" />
            AI Chat
        </TabsTrigger>
      </TabsList>
      <TabsContent value="analytics">
        <AnalyticsDashboard />
      </TabsContent>
      <TabsContent value="leads">
        <LeadAssignment />
      </TabsContent>
      <TabsContent value="advisors">
        <AdvisorList />
      </TabsContent>
       <TabsContent value="ai-chat">
        <AiChat />
      </TabsContent>
    </Tabs>
  );
}
