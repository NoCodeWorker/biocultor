'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

type Point = {
  date: string;
  revenue: number;
  orders: number;
  previousRevenue: number;
};

export default function RevenueChart({ data }: { data: Point[] }) {
  const formatted = data.map((d) => ({
    ...d,
    label: format(parseISO(d.date), 'd MMM', { locale: es }),
  }));

  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formatted} margin={{ top: 8, right: 8, bottom: 0, left: -10 }}>
          <defs>
            <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="prevFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--muted-foreground)" stopOpacity={0.18} />
              <stop offset="100%" stopColor="var(--muted-foreground)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={32}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k€` : `${v}€`)}
            width={56}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              fontSize: '12px',
            }}
            labelStyle={{ fontWeight: 700, color: 'var(--foreground)' }}
            formatter={(value, name) => [
              `€${Number(value ?? 0).toFixed(2)}`,
              name === 'revenue' ? 'Ingresos' : 'Período anterior',
            ]}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11, color: 'var(--muted-foreground)' }}
            formatter={(v) => (v === 'revenue' ? 'Ingresos' : 'Período anterior')}
          />
          <Area
            type="monotone"
            dataKey="previousRevenue"
            stroke="var(--muted-foreground)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            fill="url(#prevFill)"
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="var(--primary)"
            strokeWidth={2.5}
            fill="url(#revFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
