"use client"

import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Calendar, BookOpen, Clock, Award, Download, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function StudentCourseDetailPage() {
  const params = useParams()

  // Mock course data
  const course = {
    id: params.id,
    title: "Advanced Machine Learning",
    teacher: "Dr. Sarah Chen",
    description: "Deep dive into neural networks, deep learning, and advanced ML algorithms",
    progress: 78,
    thumbnail: "/machine-learning-course.png",
  }

  // Mock assignments
  const assignments = [
    {
      id: 1,
      title: "Neural Network Implementation",
      type: "Project",
      dueDate: "2024-02-15",
      status: "In Progress",
      score: null,
    },
    {
      id: 2,
      title: "Deep Learning Quiz",
      type: "MCQ Test",
      dueDate: "2024-02-10",
      status: "Completed",
      score: 85,
    },
    {
      id: 3,
      title: "CNN Architecture Analysis",
      type: "Essay",
      dueDate: "2024-02-20",
      status: "Not Started",
      score: null,
    },
  ]

  // Mock exams
  const exams = [
    {
      id: 1,
      title: "Midterm Exam",
      type: "Midterm",
      date: "2024-03-01",
      duration: "2 hours",
      totalMarks: 100,
      status: "Upcoming",
    },
    {
      id: 2,
      title: "Final Exam",
      type: "Endterm",
      date: "2024-04-15",
      duration: "3 hours",
      totalMarks: 150,
      status: "Upcoming",
    },
  ]

  // Mock attendance
  const attendanceStats = {
    present: 42,
    total: 45,
    percentage: 93,
  }

  // Mock materials
  const materials = [
    { name: "Lecture 1 - Introduction to ML.pdf", size: "2.4 MB", date: "2024-01-15" },
    { name: "Dataset - Housing Prices.csv", size: "1.8 MB", date: "2024-01-20" },
    { name: "Tutorial - Neural Networks.pdf", size: "3.2 MB", date: "2024-01-25" },
  ]

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="aspect-[21/9] relative overflow-hidden bg-muted rounded-lg">
          <img src={course.thumbnail || "/placeholder.svg"} alt={course.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h1 className="text-3xl font-bold text-white">{course.title}</h1>
            <p className="text-white/80 mt-1">by {course.teacher}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Progress</p>
              <p className="text-xl font-bold">{course.progress}%</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Attendance</p>
              <p className="text-xl font-bold">{attendanceStats.percentage}%</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Assignments</p>
              <p className="text-xl font-bold">{assignments.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Exams</p>
              <p className="text-xl font-bold">{exams.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="exams">Exams</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">About This Course</h3>
            <p className="text-muted-foreground">{course.description}</p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Your Progress</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Course Completion</span>
                <span className="font-medium">{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-2" />
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Upcoming Deadlines</h3>
            <div className="space-y-3">
              {assignments
                .filter((a) => a.status !== "Completed")
                .slice(0, 3)
                .map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{assignment.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">{assignment.type}</Badge>
                  </div>
                ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <div className="grid gap-4">
            {assignments.map((assignment) => (
              <Card key={assignment.id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{assignment.title}</h3>
                      <Badge variant={assignment.type === "MCQ Test" ? "default" : "secondary"}>
                        {assignment.type}
                      </Badge>
                      <Badge
                        variant={assignment.status === "Completed" ? "default" : "outline"}
                        className={
                          assignment.status === "Completed"
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : assignment.status === "In Progress"
                              ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                              : ""
                        }
                      >
                        {assignment.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </div>
                      {assignment.score !== null && (
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          Score: {assignment.score}/100
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {assignment.status === "Completed" ? (
                      <Button variant="outline" size="sm">
                        View Submission
                      </Button>
                    ) : (
                      <Button size="sm">{assignment.status === "In Progress" ? "Continue" : "Start"}</Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="exams" className="space-y-4">
          <div className="grid gap-4">
            {exams.map((exam) => (
              <Card key={exam.id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{exam.title}</h3>
                      <Badge
                        variant={exam.type === "Midterm" ? "default" : "secondary"}
                        className={
                          exam.type === "Endterm" ? "bg-purple-500/10 text-purple-500 border-purple-500/20" : ""
                        }
                      >
                        {exam.type}
                      </Badge>
                      <Badge variant="outline">{exam.status}</Badge>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(exam.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {exam.duration}
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        {exam.totalMarks} marks
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <div className="grid gap-4">
            {materials.map((material, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium">{material.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {material.size} • Uploaded {new Date(material.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Attendance Summary</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground">Total Classes</p>
                <p className="text-2xl font-bold mt-1">{attendanceStats.total}</p>
              </div>
              <div className="p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground">Classes Attended</p>
                <p className="text-2xl font-bold mt-1 text-green-500">{attendanceStats.present}</p>
              </div>
              <div className="p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground">Attendance Rate</p>
                <p className="text-2xl font-bold mt-1">{attendanceStats.percentage}%</p>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={attendanceStats.percentage} className="h-2" />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
