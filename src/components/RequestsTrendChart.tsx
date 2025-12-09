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

const chartConfig = {
  requests: {
    label: "Requests",
  },
  alerts: {
    label: "Alerts",
  },
} satisfies ChartConfig;

export const RequestsTrendChart = ({ trendData }) => {
  return (
    <Card className="bg-[var(--app-foreground)] shadow rounded-xl w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold ">
          Activities Trend
        </CardTitle>
        <CardDescription>Monthly activity trend</CardDescription>
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
                stroke="blue"
                strokeWidth={3}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="alerts"
                name="Alerts"
                stroke="red"
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
