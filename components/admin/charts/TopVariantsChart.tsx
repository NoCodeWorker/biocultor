'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

type Item = {
  variantId: string;
  sku: string;
  size: string;
  productName: string;
  qty: number;
  revenue: number;
};

const PALETTE = [
  'var(--primary)',
  '#5E8624',
  '#7A9E44',
  '#3A5610',
  '#2C420E',
  '#7D5E10',
  '#573520',
  '#3B2314',
];

export default function TopVariantsChart({ data }: { data: Item[] }) {
  const formatted = data.map((d) => ({
    name: `${d.size} · ${d.productName.split(' ')[0]}`,
    revenue: d.revenue,
    qty: d.qty,
    sku: d.sku,
  }));

  if (formatted.length === 0) {
    return (
      <div className="h-[280px] flex items-center justify-center text-sm text-muted-foreground">
        Sin ventas en el período seleccionado.
      </div>
    );
  }

  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formatted}
          layout="vertical"
          margin={{ top: 4, right: 16, bottom: 4, left: 0 }}
        >
          <XAxis
            type="number"
            hide
            tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k€` : `${v}€`)}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={140}
            tick={{ fontSize: 11, fill: 'var(--foreground)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              fontSize: '12px',
            }}
            formatter={(value, name, item: any) => {
              if (name === 'revenue') {
                return [
                  `€${Number(value ?? 0).toFixed(2)} (${item?.payload?.qty ?? 0} ud)`,
                  'Revenue',
                ];
              }
              return [String(value ?? ''), String(name ?? '')];
            }}
            labelFormatter={(label, payload) =>
              payload?.[0] ? `${label} · SKU ${payload[0].payload.sku}` : label
            }
          />
          <Bar dataKey="revenue" radius={[0, 6, 6, 0]} barSize={20}>
            {formatted.map((_, i) => (
              <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
