"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, FileText, Calendar, CheckSquare, Users, Download, Edit, Trash2, Clock, Award } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

export default function CourseDetailPage() {
  const params = useParams()
  const [selectedDate, setSelectedDate] = useState("")

  // Mock course data
  const course = {
    id: params.id,
    title: "Advanced Machine Learning",
    description: "Deep dive into neural networks, deep learning, and advanced ML algorithms",
    students: 45,
  }

  // Mock attendance data
  const attendanceRecords = [
    { id: 1, date: "2024-01-15", present: 42, absent: 3, percentage: 93 },
    { id: 2, date: "2024-01-22", present: 40, absent: 5, percentage: 89 },
    { id: 3, date: "2024-01-29", present: 44, absent: 1, percentage: 98 },
  ]

  // Mock assignments
  const assignments = [
    {
      id: 1,
      title: "Neural Network Implementation",
      type: "Project",
      dueDate: "2024-02-15",
      submissions: 38,
      total: 45,
      status: "Active",
    },
    {
      id: 2,
      title: "Deep Learning Quiz",
      type: "MCQ Test",
      dueDate: "2024-02-10",
      submissions: 45,
      total: 45,
      status: "Completed",
    },
    {
      id: 3,
      title: "CNN Architecture Analysis",
      type: "Essay",
      dueDate: "2024-02-20",
      submissions: 12,
      total: 45,
      status: "Active",
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
      status: "Scheduled",
    },
    {
      id: 2,
      title: "Final Exam",
      type: "Endterm",
      date: "2024-04-15",
      duration: "3 hours",
      totalMarks: 150,
      status: "Scheduled",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
        <p className="text-muted-foreground mt-1">{course.description}</p>
        <div className="flex items-center gap-4 mt-3 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span>{course.students} students enrolled</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="exams">Exams</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold">{course.students}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Assignments</p>
                  <p className="text-2xl font-bold">{assignments.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Exams</p>
                  <p className="text-2xl font-bold">{exams.length}</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New assignment submitted</p>
                  <p className="text-xs text-muted-foreground">John Doe submitted Neural Network Implementation</p>
                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Attendance marked</p>
                  <p className="text-xs text-muted-foreground">Attendance recorded for Jan 29, 2024</p>
                  <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Attendance Records</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Mark Attendance
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Mark Attendance</DialogTitle>
                  <DialogDescription>Record student attendance for today</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="attendance-date">Date</Label>
                    <Input
                      id="attendance-date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    <Label>Students</Label>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
                        <Checkbox id={`student-${i}`} />
                        <Label htmlFor={`student-${i}`} className="flex-1 cursor-pointer">
                          Student {i + 1}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Attendance</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {attendanceRecords.map((record) => (
              <Card key={record.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{new Date(record.date).toLocaleDateString()}</p>
                      <p className="text-sm text-muted-foreground">
                        Present: {record.present} | Absent: {record.absent}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={record.percentage >= 90 ? "default" : "secondary"}>
                      {record.percentage}% attendance
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Assignments</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Assignment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Assignment</DialogTitle>
                  <DialogDescription>Add a new assignment or test for students</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="assignment-title">Title</Label>
                    <Input id="assignment-title" placeholder="Enter assignment title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignment-type">Type</Label>
                    <Select>
                      <SelectTrigger id="assignment-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="project">Project</SelectItem>
                        <SelectItem value="essay">Essay</SelectItem>
                        <SelectItem value="mcq">MCQ Test</SelectItem>
                        <SelectItem value="practical">Practical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignment-description">Description</Label>
                    <Textarea id="assignment-description" placeholder="Describe the assignment" rows={4} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="due-date">Due Date</Label>
                      <Input id="due-date" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="total-marks">Total Marks</Label>
                      <Input id="total-marks" type="number" placeholder="100" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Create Assignment</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

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
                          assignment.status === "Completed" ? "bg-green-500/10 text-green-500 border-green-500/20" : ""
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
                      <div className="flex items-center gap-2">
                        <CheckSquare className="w-4 h-4" />
                        Submissions: {assignment.submissions}/{assignment.total}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Submissions
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="exams" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Exams</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Schedule Exam
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Schedule Exam</DialogTitle>
                  <DialogDescription>Create a midterm or endterm exam</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="exam-title">Exam Title</Label>
                    <Input id="exam-title" placeholder="Enter exam title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exam-type">Exam Type</Label>
                    <Select>
                      <SelectTrigger id="exam-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="midterm">Midterm</SelectItem>
                        <SelectItem value="endterm">Endterm</SelectItem>
                        <SelectItem value="quiz">Quiz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="exam-date">Date</Label>
                      <Input id="exam-date" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exam-duration">Duration</Label>
                      <Input id="exam-duration" placeholder="e.g., 2 hours" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="total-marks">Total Marks</Label>
                    <Input id="total-marks" type="number" placeholder="100" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Schedule Exam</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

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
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Course Materials</h2>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Upload Material
            </Button>
          </div>

          <div className="grid gap-4">
            {[
              { name: "Lecture 1 - Introduction to ML.pdf", size: "2.4 MB", date: "2024-01-15" },
              { name: "Dataset - Housing Prices.csv", size: "1.8 MB", date: "2024-01-20" },
              { name: "Tutorial - Neural Networks.pdf", size: "3.2 MB", date: "2024-01-25" },
            ].map((material, i) => (
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
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
