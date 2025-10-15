"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Play, BookOpen, Clock, Users } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

const enrolledCourses = [
  {
    id: 1,
    title: "Advanced Machine Learning",
    teacher: "Dr. Sarah Chen",
    progress: 78,
    duration: "12 weeks",
    students: 45,
    thumbnail: "/machine-learning-course.png",
  },
  {
    id: 2,
    title: "Web Development Fundamentals",
    teacher: "Prof. Michael Brown",
    progress: 45,
    duration: "10 weeks",
    students: 78,
    thumbnail: "/web-development-course.png",
  },
  {
    id: 3,
    title: "Data Science Bootcamp",
    teacher: "Dr. Emily Rodriguez",
    progress: 92,
    duration: "8 weeks",
    students: 62,
    thumbnail: "/data-science-course.png",
  },
]

const availableCourses = [
  {
    id: 4,
    title: "Mobile App Design",
    teacher: "Prof. James Wilson",
    duration: "6 weeks",
    students: 34,
    rating: 4.8,
    thumbnail: "/mobile-app-design-course.jpg",
  },
  {
    id: 5,
    title: "Cloud Computing Essentials",
    teacher: "Dr. Lisa Anderson",
    duration: "8 weeks",
    students: 56,
    rating: 4.6,
    thumbnail: "/cloud-computing-course.png",
  },
  {
    id: 6,
    title: "Cybersecurity Fundamentals",
    teacher: "Prof. Robert Taylor",
    duration: "10 weeks",
    students: 42,
    rating: 4.9,
    thumbnail: "/cybersecurity-course.png",
  },
]

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
        <p className="text-muted-foreground mt-1">Manage your learning journey</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search courses..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="enrolled" className="space-y-6">
        <TabsList>
          <TabsTrigger value="enrolled">Enrolled ({enrolledCourses.length})</TabsTrigger>
          <TabsTrigger value="available">Available ({availableCourses.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="enrolled" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:border-primary/50 transition-colors group">
                <div className="aspect-video relative overflow-hidden bg-muted">
                  <img
                    src={course.thumbnail || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="lg" className="gap-2" asChild>
                      <Link href={`/student/courses/${course.id}`}>
                        <Play className="w-5 h-5" />
                        Continue Learning
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold line-clamp-1">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">by {course.teacher}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {course.students}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                <div className="aspect-video relative overflow-hidden bg-muted">
                  <img
                    src={course.thumbnail || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold line-clamp-1">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">by {course.teacher}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {course.students}
                    </div>
                    <div className="flex items-center gap-1">⭐ {course.rating}</div>
                  </div>
                  <Button className="w-full gap-2">
                    <BookOpen className="w-4 h-4" />
                    Enroll Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
