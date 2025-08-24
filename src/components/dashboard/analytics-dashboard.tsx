"use client"

import { useAppContext } from "@/context/app-context";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "../ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from "recharts";

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


    const chartConfig = {
        leads: { label: "Leads" },
        todo: { label: "To Do", color: "hsl(var(--chart-3))" },
        contacted: { label: "Contacted", color: "hsl(var(--chart-4))" },
        converted: { label: "Converted", color: "hsl(var(--chart-2))" },
    }

    const COLORS = ['hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-2))'];


    return (
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
                            margin={{
                                left: 10,
                            }}
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
                            <Bar dataKey="todo" stackId="a" fill="var(--color-todo)" radius={[0, 4, 4, 0]} />
                            <Bar dataKey="contacted" stackId="a" fill="var(--color-contacted)" />
                            <Bar dataKey="converted" stackId="a" fill="var(--color-converted)" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card className="col-span-4 lg:col-span-3">
                <CardHeader>
                    <CardTitle>Overall Lead Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{}} className="h-[350px] w-full">
                         <PieChart>
                            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                            <Pie
                                data={overallStatus}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={120}
                                labelLine={false}
                                label={({
                                    cx,
                                    cy,
                                    midAngle,
                                    innerRadius,
                                    outerRadius,
                                    value,
                                    index,
                                }) => {
                                    const RADIAN = Math.PI / 180
                                    const radius = 25 + innerRadius + (outerRadius - innerRadius)
                                    const x = cx + radius * Math.cos(-midAngle * RADIAN)
                                    const y = cy + radius * Math.sin(-midAngle * RADIAN)

                                    return (
                                        <text
                                        x={x}
                                        y={y}
                                        fill="hsl(var(--foreground))"
                                        textAnchor={x > cx ? "start" : "end"}
                                        dominantBaseline="central"
                                        className="text-xs font-semibold"
                                        >
                                        {overallStatus[index].name} ({value})
                                        </text>
                                    )
                                }}
                            >
                                {overallStatus.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    )
}