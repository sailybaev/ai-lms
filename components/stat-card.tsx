import { Card } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: {
    value: string
    positive: boolean
  }
}

export function StatCard({ title, value, description, icon: Icon, trend }: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
          {trend && (
            <p className={`text-xs font-medium ${trend.positive ? "text-green-500" : "text-red-500"}`}>
              {trend.positive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </Card>
  )
}
