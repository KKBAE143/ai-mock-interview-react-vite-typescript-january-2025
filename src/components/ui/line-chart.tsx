'use client';

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface LineChartProps {
  data: Array<{
    [key: string]: string | number;
  }>;
  dataKey: string;
  xAxisKey?: string;
  height?: number;
  tooltipFormatter?: (value: number) => string;
}

export function LineChart({
  data,
  dataKey,
  xAxisKey = 'name',
  height = 300,
  tooltipFormatter
}: LineChartProps) {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={xAxisKey}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={tooltipFormatter}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
} 