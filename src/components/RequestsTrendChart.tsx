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

export const RequestsTrendChart = ({
  trendData,
}: {
  trendData: Array<Record<string, unknown>>;
}) => {
  return (
    <Card className="bg-white/5 border-white/10 shadow-lg shadow-black/20 w-full overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-white tracking-tight">
          Activities Trend
        </CardTitle>
        <CardDescription className="text-white/50 font-medium">
          Monthly activity overview
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 w-full h-[350px]">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trendData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#ffffff10"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                stroke="#ffffff40"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="#ffffff40"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dx={-10}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent className="bg-[#020617] border-white/10 text-white font-medium shadow-xl" />
                }
              />
              <Line
                type="monotone"
                dataKey="requests"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ fill: "#6366f1", strokeWidth: 2, r: 4 }}
                activeDot={{
                  r: 6,
                  fill: "#818cf8",
                  stroke: "#020617",
                  strokeWidth: 2,
                }}
              />
              <Line
                type="monotone"
                dataKey="alerts"
                name="Alerts"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                activeDot={{
                  r: 6,
                  fill: "#f87171",
                  stroke: "#020617",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
