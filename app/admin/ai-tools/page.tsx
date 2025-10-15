"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, FileText, AlertTriangle, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function AIToolsPage() {
  const [generating, setGenerating] = useState(false)
  const [report, setReport] = useState("")

  const generateReport = () => {
    setGenerating(true)
    setTimeout(() => {
      setReport(`Platform Performance Summary - ${new Date().toLocaleDateString()}

Key Insights:
• User engagement has increased by 12% over the past week
• Peak activity hours are between 12 PM - 6 PM
• Course completion rates are slightly below target at 68%
• Student satisfaction rating remains high at 4.7/5.0

Recommendations:
1. Focus on improving course completion rates through better engagement strategies
2. Consider adding more interactive content during peak hours
3. Implement personalized learning paths for struggling students
4. Expand course offerings in high-demand categories

Anomalies Detected:
• Unusual drop in weekend activity (investigate potential technical issues)
• Three courses showing significantly lower engagement than average`)
      setGenerating(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Tools</h1>
        <p className="text-muted-foreground mt-1">Leverage AI to gain insights and automate tasks</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">Generate Report Summary</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Create AI-generated insights on platform performance and user behavior
              </p>
            </div>
          </div>
          <Button onClick={generateReport} disabled={generating} className="w-full gap-2">
            <Sparkles className="w-4 h-4" />
            {generating ? "Generating..." : "Generate Summary"}
          </Button>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">Detect Anomalies</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Identify unusual activity patterns, low engagement, or inactive users
              </p>
            </div>
          </div>
          <Button variant="outline" className="w-full gap-2 bg-transparent">
            <AlertTriangle className="w-4 h-4" />
            Run Detection
          </Button>
        </Card>
      </div>

      {report && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">AI-Generated Report</h3>
            </div>
            <Badge variant="outline" className="gap-1">
              <TrendingUp className="w-3 h-3" />
              Fresh
            </Badge>
          </div>
          <Textarea value={report} readOnly className="min-h-[400px] font-mono text-sm" />
          <div className="flex gap-2">
            <Button variant="outline">Copy to Clipboard</Button>
            <Button variant="outline">Export as PDF</Button>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recent AI Activities</h3>
          <div className="space-y-3">
            {[
              { action: "Report generated", time: "2 hours ago", type: "success" },
              { action: "Anomaly detected: Low weekend activity", time: "5 hours ago", type: "warning" },
              { action: "User engagement analysis completed", time: "1 day ago", type: "success" },
              { action: "Course recommendation model updated", time: "2 days ago", type: "info" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.type === "success"
                        ? "bg-green-500"
                        : activity.type === "warning"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                    }`}
                  />
                  <span className="text-sm font-medium">{activity.action}</span>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
