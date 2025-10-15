"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users, FileText, BarChart3, Settings } from "lucide-react"
import { Progress } from "@/components/ui/progress"
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
import Link from "next/link"

const courses = [
  {
    id: 1,
    title: "Advanced Machine Learning",
    description: "Deep dive into neural networks, deep learning, and advanced ML algorithms",
    students: 45,
    lessons: 24,
    completion: 78,
    status: "Active",
  },
  {
    id: 2,
    title: "Web Development Fundamentals",
    description: "Learn HTML, CSS, JavaScript, and modern web development practices",
    students: 78,
    lessons: 32,
    completion: 65,
    status: "Active",
  },
  {
    id: 3,
    title: "Data Science Bootcamp",
    description: "Comprehensive introduction to data analysis, visualization, and machine learning",
    students: 62,
    lessons: 28,
    completion: 92,
    status: "Active",
  },
]

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
          <p className="text-muted-foreground mt-1">Manage and create your courses</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
              <DialogDescription>Add a new course to your teaching portfolio</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="course-title">Course Title</Label>
                <Input id="course-title" placeholder="Enter course title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course-description">Description</Label>
                <Textarea id="course-description" placeholder="Describe your course" rows={4} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" placeholder="e.g., Computer Science" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Input id="level" placeholder="e.g., Intermediate" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Create Course</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="p-6 hover:border-primary/50 transition-colors">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                  {course.status}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{course.students}</span>
                  <span className="text-muted-foreground">students</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{course.lessons}</span>
                  <span className="text-muted-foreground">lessons</span>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">Avg. Completion:</span>
                    <Progress value={course.completion} className="flex-1" />
                    <span className="text-sm font-medium">{course.completion}%</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button asChild variant="default" size="sm">
                  <Link href={`/teacher/courses/${course.id}`}>Open Course</Link>
                </Button>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </Button>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
