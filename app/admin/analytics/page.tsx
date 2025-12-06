"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Activity, Clock } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const userDistribution = [
  { name: "Students", value: 1128, color: "hsl(var(--chart-1))" },
  { name: "Teachers", value: 156, color: "hsl(var(--chart-2))" },
  { name: "Admins", value: 12, color: "hsl(var(--chart-3))" },
]

const courseEngagement = [
  { course: "ML Advanced", engagement: 85 },
  { course: "Web Dev", engagement: 72 },
  { course: "Data Science", engagement: 68 },
  { course: "Mobile Design", engagement: 79 },
  { course: "Cloud Computing", engagement: 64 },
]

const peakHours = [
  { hour: "6AM", users: 45 },
  { hour: "9AM", users: 280 },
  { hour: "12PM", users: 420 },
  { hour: "3PM", users: 380 },
  { hour: "6PM", users: 450 },
  { hour: "9PM", users: 320 },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Analytics</h1>
          <p className="text-muted-foreground mt-1">Comprehensive insights into platform performance</p>
        </div>
        <Button variant="outline">Export Report</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Avg. Session Time</p>
              <p className="text-2xl font-bold">24m 32s</p>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +8% from last week
              </p>
            </div>
            <Clock className="w-8 h-8 text-muted-foreground" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Daily Active Users</p>
              <p className="text-2xl font-bold">892</p>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12% from yesterday
              </p>
            </div>
            <Activity className="w-8 h-8 text-muted-foreground" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Course Completion</p>
              <p className="text-2xl font-bold">68%</p>
              <p className="text-xs text-red-500 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                -3% from last month
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-muted-foreground" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Avg. Rating</p>
              <p className="text-2xl font-bold">4.7 ⭐</p>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +0.2 from last month
              </p>
            </div>
            <Activity className="w-8 h-8 text-muted-foreground" />
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">User Distribution</h3>
              <p className="text-sm text-muted-foreground">Breakdown by role</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Peak Activity Hours</h3>
              <p className="text-sm text-muted-foreground">Active users throughout the day</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={peakHours}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="users" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Course Engagement Rates</h3>
            <p className="text-sm text-muted-foreground">Top performing courses by student engagement</p>
          </div>
          <div className="space-y-3">
            {courseEngagement.map((course, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium truncate">{course.course}</div>
                <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${course.engagement}%` }}
                  />
                </div>
                <div className="w-12 text-sm font-medium text-right">{course.engagement}%</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
