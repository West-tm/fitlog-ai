"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type WeightChartPoint = {
  date: string;
  weightKg: number;
};

type WeightChartProps = {
  chartData: WeightChartPoint[];
};

const chartConfig = {
  weightKg: {
    label: "平均体重",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const formatDateLabel = (date: string) => {
  const [, month, day] = date.split("-");

  return `${Number(month)}月${Number(day)}日`;
};

export default function WeightTrendChart({ chartData }: WeightChartProps) {
  const [timeRange, setTimeRange] = useState("90");

  if (chartData.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        体重ログがまだありません。
      </p>
    );
  }

  const referenceDate = new Date(
    Math.max(...chartData.map((item) => new Date(item.date).getTime())),
  );

  const filteredData = chartData.filter((item) => {
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - Number(timeRange) + 1);

    return new Date(item.date) >= startDate;
  });

  return (
    <Card className="pt-0">
      <CardHeader
        className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row"
      >
        <div className="grid flex-1 gap-1">
          <CardTitle>体重推移</CardTitle>
          <CardDescription>
            指定した期間の体重推移を確認することが出来ます
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="rounded-lg sm:ml-auto sm:flex sm:w-40"
            aria-label="Select a value"
          >
            <SelectValue placeholder="週" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="365" className="rounded-lg">
              年
            </SelectItem>
            <SelectItem value="90" className="rounded-lg">
              3か月
            </SelectItem>
            <SelectItem value="30" className="rounded-lg">
              月
            </SelectItem>
            <SelectItem value="7" className="rounded-lg">
              週
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-62.5 w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-2)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-2)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => formatDateLabel(value)}
            />
            <YAxis
              width={48}
              domain={[
                (dataMin: number) => Math.floor(dataMin - 1),
                (dataMax: number) => Math.ceil(dataMax + 1),
              ]}
              tickFormatter={(value: number) => `${value}kg`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => [
                    "平均体重：",
                    `${Number(value).toFixed(1)}kg`,
                  ]}
                  labelFormatter={(value) => formatDateLabel(value)}
                  indicator="dot"
                />
              }
            />

            <Area
              dataKey="weightKg"
              type="linear"
              fill="url(#fillDesktop)"
              stroke="var(--chart-2)"
              dot={
                Number(timeRange) <= 30 && {
                  r: 3,
                  fill: "var(--background)",
                  fillOpacity: 1,
                  stroke: "var(--chart-2)",
                }
              }
              activeDot={{
                r: 5,
                fill: "var(--background)",
                stroke: "var(--chart-2)",
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
