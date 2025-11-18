"use client";

import { useState, useEffect } from "react";
import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import type { ChartConfig } from "@/components/ui/chart";

const chartData = [
  { label: "Chrome", value: 275, fill: "var(--chart-1)" },
  { label: "Safari", value: 200, fill: "var(--chart-2)" },
  { label: "Firefox", value: 187, fill: "var(--chart-3)" },
  { label: "Edge", value: 173, fill: "var(--chart-4)" },
  { label: "Other", value: 90, fill: "var(--chart-5)" },
];

const chartConfig = {
  value: { label: "Users" },
} satisfies ChartConfig;

export function PieChartDonut() {
  const [radius, setRadius] = useState({
    inner: 45,
    outer: 75,
  });

  useEffect(() => {
    const updateRadius = () => {
      const width = window.innerWidth;

      if (width > 1600) {
        setRadius({ inner: 55, outer: 85 });
      } else if (width > 1024) {
        setRadius({ inner: 35, outer: 60 });
      } else if (width > 640) {
        setRadius({ inner: 35, outer: 55 });
      } else {
        setRadius({ inner: 30, outer: 50 });
      }
    };

    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  return (
    <Card className="flex flex-col w-full max-w-full overflow-hidden">
      <CardHeader className="items-center pb-0 text-center">
        <h3 className="text-sm text-gray-600">Users</h3>
        <CardTitle className="text-3xl font-semibold">4890</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-4 flex justify-center items-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-[110px] sm:w-[110px] md:w-[120px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <Pie
              data={chartData}
              dataKey="value"
              nameKey="label"
              innerRadius={radius.inner}
              outerRadius={radius.outer}
              paddingAngle={2}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
