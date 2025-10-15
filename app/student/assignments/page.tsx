import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react"

const assignments = [
  {
    id: 1,
    title: "Neural Network Implementation",
    course: "Advanced Machine Learning",
    dueDate: "2025-01-20",
    status: "pending",
    grade: null,
  },
  {
    id: 2,
    title: "Build a React Component Library",
    course: "Web Development Fundamentals",
    dueDate: "2025-01-18",
    status: "pending",
    grade: null,
  },
  {
    id: 3,
    title: "Data Analysis Project",
    course: "Data Science Bootcamp",
    dueDate: "2025-01-15",
    status: "submitted",
    grade: null,
  },
  {
    id: 4,
    title: "Backpropagation Algorithm",
    course: "Advanced Machine Learning",
    dueDate: "2025-01-10",
    status: "graded",
    grade: 95,
  },
  {
    id: 5,
    title: "JavaScript ES6 Quiz",
    course: "Web Development Fundamentals",
    dueDate: "2025-01-08",
    status: "graded",
    grade: 88,
  },
]

export default function AssignmentsPage() {
  const pendingAssignments = assignments.filter((a) => a.status === "pending")
  const submittedAssignments = assignments.filter((a) => a.status === "submitted")
  const gradedAssignments = assignments.filter((a) => a.status === "graded")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
        <p className="text-muted-foreground mt-1">Track your assignments and submissions</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Pending</p>
            <p className="text-3xl font-bold">{pendingAssignments.length}</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Submitted</p>
            <p className="text-3xl font-bold">{submittedAssignments.length}</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Average Grade</p>
            <p className="text-3xl font-bold">
              {Math.round(gradedAssignments.reduce((acc, a) => acc + (a.grade || 0), 0) / gradedAssignments.length)}%
            </p>
          </div>
        </Card>
      </div>

      {pendingAssignments.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Pending Assignments</h2>
          <div className="space-y-3">
            {pendingAssignments.map((assignment) => (
              <Card key={assignment.id} className="p-4 hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{assignment.title}</h3>
                    <p className="text-sm text-muted-foreground">{assignment.course}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Due Date</p>
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {assignment.dueDate}
                      </p>
                    </div>
                    <Button>Submit</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {submittedAssignments.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Submitted Assignments</h2>
          <div className="space-y-3">
            {submittedAssignments.map((assignment) => (
              <Card key={assignment.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{assignment.title}</h3>
                    <p className="text-sm text-muted-foreground">{assignment.course}</p>
                  </div>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                    Awaiting Grade
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {gradedAssignments.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Graded Assignments</h2>
          <div className="space-y-3">
            {gradedAssignments.map((assignment) => (
              <Card key={assignment.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{assignment.title}</h3>
                    <p className="text-sm text-muted-foreground">{assignment.course}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Grade</p>
                      <p className="text-2xl font-bold text-green-500">{assignment.grade}%</p>
                    </div>
                    <Button variant="outline">View Feedback</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
