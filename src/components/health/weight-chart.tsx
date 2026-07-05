"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type WeightChartPoint = {
  date: string;
  weightKg: number;
};

type WeightChartProps = {
  data: WeightChartPoint[];
};

export function WeightChart({ data }: WeightChartProps) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        体重ログがまだありません。
      </p>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(value: string) => value.slice(5)}
          />
          <YAxis
            width={48}
            domain={[
              (dataMin: number) => Math.floor(dataMin - 1),
              (dataMax: number) => Math.ceil(dataMax + 1),
            ]}
            tickFormatter={(value: number) => `${value}kg`}
          />
          <Tooltip
            formatter={(value) => [`${Number(value).toFixed(1)}kg`, "平均体重"]}
            labelFormatter={(label) => `日付: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="weightKg"
            stroke="var(--chart-2)"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
