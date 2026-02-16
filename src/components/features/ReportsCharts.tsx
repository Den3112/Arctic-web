'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDuration } from '@/services/timeUtils';
import { useLanguage } from '@/contexts/LanguageContext';

interface ReportsChartsProps {
  data: {
    name: string;
    value: number; // duration in ms
    color: string;
  }[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    payload: {
      name: string;
      value: number;
      color: string;
    };
  }[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    return (
      <div className="glass-card p-3 border-none shadow-xl rounded-xl">
        <p className="font-bold text-sm mb-1">{dataPoint.name}</p>
        <p className="text-primary font-mono font-bold">
          {formatDuration(dataPoint.value)}
        </p>
      </div>
    );
  }
  return null;
};

export function ReportsBarChart({ data }: ReportsChartsProps) {
  const { t } = useLanguage();

  if (data.length === 0) return null;

  const chartData = data.map((item) => ({
    ...item,
    hours: Number((item.value / (1000 * 60 * 60)).toFixed(2)),
  }));

  return (
    <Card className="glass-card border-none overflow-hidden h-[420px]">
      <CardHeader>
        <CardTitle
          data-testid="time-distribution-bar-title"
          className="text-sm font-medium text-muted-foreground uppercase tracking-widest"
        >
          {t.reports.timeByProject}
        </CardTitle>
      </CardHeader>
      <CardContent
        className="h-[340px] w-full"
        data-testid="time-distribution-chart"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}h`}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            />
            <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ReportsPieChart({
  data,
  totalTime,
}: ReportsChartsProps & { totalTime: number }) {
  const { t } = useLanguage();

  if (data.length === 0) return null;

  return (
    <Card className="glass-card border-none overflow-hidden h-[420px]">
      <CardHeader>
        <CardTitle
          data-testid="time-distribution-pie-title"
          className="text-sm font-medium text-muted-foreground uppercase tracking-widest"
        >
          {t.reports.timeDistribution}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[340px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              paddingAngle={2}
              label={({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                value,
              }) => {
                const RADIAN = Math.PI / 180;
                const radius = 25 + innerRadius + (outerRadius - innerRadius);
                const x = cx + radius * Math.cos(-(midAngle || 0) * RADIAN);
                const y = cy + radius * Math.sin(-(midAngle || 0) * RADIAN);
                const percent = value / totalTime;
                if (percent < 0.05) return null;
                return (
                  <text
                    x={x}
                    y={y}
                    fill="white"
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                    className="text-xs font-bold"
                  >
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                );
              }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth={1}
                />
              ))}
            </Pie>
            <Tooltip
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const dataPoint = payload[0].payload;
                  return (
                    <div className="glass-card px-3 py-2 text-xs font-medium border-none shadow-xl rounded-xl backdrop-blur-md">
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: dataPoint.color }}
                        />
                        <span>{dataPoint.name}</span>
                      </div>
                      <div className="font-mono text-primary font-bold">
                        {formatDuration(dataPoint.value)}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              content={(props: {
                payload?: readonly { color?: string; value: unknown }[];
              }) => {
                const { payload } = props;
                return (
                  <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground mt-4">
                    {payload?.map((entry, index: number) => (
                      <div
                        key={`item-${index}`}
                        className="flex items-center gap-2"
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span>{entry.value as string}</span>
                      </div>
                    ))}
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
