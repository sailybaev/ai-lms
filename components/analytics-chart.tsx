"use client"

import { Card } from "@/components/ui/card"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface AnalyticsChartProps {
  title: string
  description?: string
  data: Array<Record<string, string | number>>
  dataKey: string
  xAxisKey: string
  type?: "bar" | "line"
  color?: string
}

export function AnalyticsChart({
  title,
  description,
  data,
  dataKey,
  xAxisKey,
  type = "bar",
  color = "hsl(var(--primary))",
}: AnalyticsChartProps) {
  const ChartComponent = type === "bar" ? BarChart : LineChart

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <ChartComponent data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey={xAxisKey} stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            {type === "bar" ? (
              <Bar dataKey={dataKey} fill={color} radius={[8, 8, 0, 0]} />
            ) : (
              <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} />
            )}
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
