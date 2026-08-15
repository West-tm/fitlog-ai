"use client";

import { useId, useState } from "react";
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

type TrendChartPoint = {
  date: string;
  value: number;
};

type TrendChartProps = {
  chartData: TrendChartPoint[];
  label: string;
  unit: string;
  fractionDigits?: number;
};

const DOMAIN_PADDING_RATIO = 0.1;

const getPaddedDomain = (
  dataMin: number,
  dataMax: number,
): [number, number] => {
  const range = dataMax - dataMin;
  const padding =
    range === 0
      ? Math.abs(dataMax) * DOMAIN_PADDING_RATIO || 1
      : range * DOMAIN_PADDING_RATIO;

  return [Math.max(0, dataMin - padding), dataMax + padding];
};

const formatDateLabel = (date: string) => {
  const [, month, day] = date.split("-");

  return `${Number(month)}月${Number(day)}日`;
};

export default function TrendChart({
  chartData,
  label,
  unit,
  fractionDigits = 0,
}: TrendChartProps) {
  const chartConfig = {
    value: {
      label,
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const [timeRange, setTimeRange] = useState("90");
  // useId はコロンを含むので、SVG の url(#...) では使えない
  const gradientId = `fill-${useId().replaceAll(":", "")}`;

  if (chartData.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {label}ログがまだありません。
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

  const values = filteredData.map((item) => item.value);
  const yDomain =
    values.length === 0
      ? undefined
      : getPaddedDomain(Math.min(...values), Math.max(...values));

  return (
    <Card className="pt-0">
      <CardHeader
        className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row"
      >
        <div className="grid flex-1 gap-1">
          <CardTitle>{label}推移</CardTitle>
          <CardDescription>
            指定した期間の{label}推移を確認することが出来ます
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="rounded-lg sm:ml-auto sm:flex sm:w-40"
            aria-label="期間を選択"
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
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
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
              width={64}
              domain={yDomain}
              tickFormatter={(value: number) =>
                `${Number(value).toFixed(fractionDigits)}${unit}`
              }
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => [
                    `${label}：`,
                    `${Number(value).toFixed(fractionDigits)}${unit}`,
                  ]}
                  labelFormatter={(value) => formatDateLabel(value)}
                  indicator="dot"
                />
              }
            />

            <Area
              dataKey="value"
              type="linear"
              fill={`url(#${gradientId})`}
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
