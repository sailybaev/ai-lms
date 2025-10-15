"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, CheckCircle, XCircle, BarChart3 } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const mockCourses = [
  {
    id: 1,
    title: "Advanced Machine Learning",
    teacher: "Dr. Sarah Chen",
    students: 45,
    completion: 78,
    rating: 4.8,
    status: "Active",
  },
  {
    id: 2,
    title: "Web Development Fundamentals",
    teacher: "Prof. Michael Brown",
    students: 78,
    completion: 65,
    rating: 4.6,
    status: "Active",
  },
  {
    id: 3,
    title: "Data Science Bootcamp",
    teacher: "Dr. Emily Rodriguez",
    students: 62,
    completion: 45,
    rating: 4.9,
    status: "Pending",
  },
  {
    id: 4,
    title: "Mobile App Design",
    teacher: "Prof. James Wilson",
    students: 34,
    completion: 82,
    rating: 4.7,
    status: "Active",
  },
  {
    id: 5,
    title: "Cloud Computing Essentials",
    teacher: "Dr. Lisa Anderson",
    students: 56,
    completion: 58,
    rating: 4.5,
    status: "Active",
  },
]

export default function CoursesPage() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCourses = mockCourses.filter((course) => {
    const matchesStatus = statusFilter === "all" || course.status.toLowerCase() === statusFilter
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.teacher.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Course Oversight</h1>
        <p className="text-muted-foreground mt-1">Monitor and manage all courses on the platform</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
            <p className="text-3xl font-bold">{mockCourses.length}</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Active Courses</p>
            <p className="text-3xl font-bold">{mockCourses.filter((c) => c.status === "Active").length}</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Avg. Completion Rate</p>
            <p className="text-3xl font-bold">
              {Math.round(mockCourses.reduce((acc, c) => acc + c.completion, 0) / mockCourses.length)}%
            </p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search courses or teachers..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="p-4 hover:border-primary/50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">{course.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">by {course.teacher}</p>
                      </div>
                      <Badge
                        variant={course.status === "Active" ? "default" : "secondary"}
                        className={course.status === "Active" ? "bg-green-500/10 text-green-500" : ""}
                      >
                        {course.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Students:</span>
                        <span className="font-medium">{course.students}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Rating:</span>
                        <span className="font-medium">⭐ {course.rating}</span>
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-sm">Completion:</span>
                          <Progress value={course.completion} className="flex-1" />
                          <span className="text-sm font-medium">{course.completion}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {course.status === "Pending" ? (
                      <>
                        <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="gap-2 text-destructive bg-transparent">
                          <XCircle className="w-4 h-4" />
                          Reject
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                        <BarChart3 className="w-4 h-4" />
                        Analytics
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
