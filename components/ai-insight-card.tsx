import { Card } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import type { ReactNode } from "react"

interface AIInsightCardProps {
  title: string
  insights: string[]
  icon?: ReactNode
}

export function AIInsightCard({ title, insights, icon }: AIInsightCardProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          {icon || <Sparkles className="w-5 h-5 text-primary" />}
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div key={index} className="p-3 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
