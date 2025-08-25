"use client"

import { useAppContext } from "@/context/app-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "../ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell, Funnel, FunnelChart, LabelList } from "recharts";
import { ArrowDownRight, ArrowUpRight, Target } from "lucide-react";

export default function AnalyticsDashboard() {
    const { leads, advisors } = useAppContext();

    const leadsPerAdvisor = advisors.map(advisor => {
        const advisorLeads = leads.filter(lead => lead.advisorId === advisor.id);
        return {
            advisor: advisor.name,
            leads: advisorLeads.length,
            todo: advisorLeads.filter(l => l.status === "To Do").length,
            contacted: advisorLeads.filter(l => l.status === "Contacted").length,
            converted: advisorLeads.filter(l => l.status === "Converted").length,
        }
    });

    const overallStatus = leads.reduce((acc, lead) => {
        if (lead.status === "To Do") acc[0].value++;
        if (lead.status === "Contacted") acc[1].value++;
        if (lead.status === "Converted") acc[2].value++;
        return acc;
    }, [
        { name: "To Do", value: 0, fill: "hsl(var(--chart-3))" },
        { name: "Contacted", value: 0, fill: "hsl(var(--chart-4))" },
        { name: "Converted", value: 0, fill: "hsl(var(--chart-2))" }
    ]);
    
    const funnelData = [
        { name: "Total Leads", value: leads.length, fill: "hsl(var(--chart-1))" },
        { name: "Contacted", value: leads.filter(l => l.status === "Contacted" || l.status === "Converted").length, fill: "hsl(var(--chart-2))" },
        { name: "Converted", value: leads.filter(l => l.status === "Converted").length, fill: "hsl(var(--chart-5))" },
    ];
    
    const totalLeads = leads.length;
    const totalConverted = funnelData[2].value;
    const conversionRate = totalLeads > 0 ? ((totalConverted / totalLeads) * 100).toFixed(1) : 0;

    const convertedLeads = leads.filter(l => l.status === "Converted");
    const conversionTimes = convertedLeads.map(l => {
        const creationDate = new Date(l.history.find(h => h.type === 'CREATION')?.date || l.history[l.history.length - 1].date).getTime();
        const conversionDate = new Date(l.history.find(h => h.newValue === 'Converted')?.date || new Date().toISOString()).getTime();
        return (conversionDate - creationDate) / (1000 * 3600 * 24); // in days
    });

    const avgConversionTime = conversionTimes.length > 0
        ? (conversionTimes.reduce((a, b) => a + b, 0) / conversionTimes.length).toFixed(1)
        : 'N/A';


    const chartConfig = {
        leads: { label: "Leads" },
        todo: { label: "To Do", color: "hsl(var(--chart-3))" },
        contacted: { label: "Contacted", color: "hsl(var(--chart-4))" },
        converted: { label: "Converted", color: "hsl(var(--chart-2))" },
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalLeads}</div>
                        <p className="text-xs text-muted-foreground">+10% from last month</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{conversionRate}%</div>
                        <p className="text-xs text-muted-foreground">+2.5% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Conversion Time</CardTitle>
                        <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgConversionTime} days</div>
                        <p className="text-xs text-muted-foreground">-0.5 days from last month</p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Leads per Advisor</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ChartContainer config={chartConfig} className="h-[350px] w-full">
                            <BarChart
                                data={leadsPerAdvisor}
                                layout="vertical"
                                margin={{ left: 10 }}
                            >
                                <CartesianGrid horizontal={false} />
                                <YAxis
                                    dataKey="advisor"
                                    type="category"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={10}
                                    minTickGap={1}
                                />
                                <XAxis dataKey="leads" type="number" hide />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Bar dataKey="todo" stackId="a" fill="var(--color-todo)" radius={[4, 0, 0, 4]} />
                                <Bar dataKey="contacted" stackId="a" fill="var(--color-contacted)" />
                                <Bar dataKey="converted" stackId="a" fill="var(--color-converted)" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card className="col-span-4 lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Conversion Funnel</CardTitle>
                    </CardHeader>
                    <CardContent className="mx-auto aspect-square max-h-[350px]">
                        <ChartContainer config={{}} className="w-full h-full">
                            <FunnelChart layout="vertical" data={funnelData}>
                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                <Funnel dataKey="value" nameKey="name" >
                                    <LabelList position="right" fill="#000" stroke="none" dataKey="name" className="font-semibold"/>
                                </Funnel>
                            </FunnelChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
