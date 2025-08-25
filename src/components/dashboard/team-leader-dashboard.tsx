"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdvisorList from "./advisor-list";
import LeadAssignment from "./lead-assignment";
import AnalyticsDashboard from "./analytics-dashboard";
import { Users, ListChecks, BarChart, Bot } from "lucide-react";
import AiChat from "./ai-chat";

export default function TeamLeaderDashboard() {
  return (
    <Tabs defaultValue="analytics" className="w-full space-y-4">
      <div className="w-full overflow-x-auto">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 sm:w-auto">
            <TabsTrigger value="analytics">
                <BarChart className="mr-2 h-5 w-5" />
                Analytics
            </TabsTrigger>
            <TabsTrigger value="leads">
                <ListChecks className="mr-2 h-5 w-5" />
                Lead Assignment
            </TabsTrigger>
            <TabsTrigger value="advisors">
                <Users className="mr-2 h-5 w-5" />
                Advisors
            </TabsTrigger>
            <TabsTrigger value="ai-chat">
                <Bot className="mr-2 h-5 w-5" />
                AI Chat
            </TabsTrigger>
        </TabsList>
      </div>
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
