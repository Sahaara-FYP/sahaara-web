"use client";

import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import type { ChartConfig } from "@/components/ui/chart";

const trendData = [
  { month: "Jan", requests: 120 },
  { month: "Feb", requests: 180 },
  { month: "Mar", requests: 150 },
  { month: "Apr", requests: 220 },
  { month: "May", requests: 260 },
  { month: "Jun", requests: 310 },
];

const chartConfig = {
  requests: {
    label: "Requests",
  },
} satisfies ChartConfig;

export const RequestsTrendChart = () => {
  return (
    <Card className="bg-[var(--app-foreground)] shadow rounded-xl w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold ">Requests Trend</CardTitle>
        <CardDescription>Monthly request activity (Jan - Jun)</CardDescription>
      </CardHeader>

      <CardContent className="p-6 w-full h-[350px]">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" stroke="gray" fontSize={12} />
              <YAxis stroke="gray" fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="requests"
                stroke="var(--app-primary-color)"
                strokeWidth={3}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
