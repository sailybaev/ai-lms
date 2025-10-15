import { StatCard } from "@/components/stat-card"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Award, TrendingUp, Flame, Play, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const enrolledCourses = [
  {
    id: 1,
    title: "Advanced Machine Learning",
    teacher: "Dr. Sarah Chen",
    progress: 78,
    nextLesson: "Neural Network Optimization",
    thumbnail: "/machine-learning-course.png",
  },
  {
    id: 2,
    title: "Web Development Fundamentals",
    teacher: "Prof. Michael Brown",
    progress: 45,
    nextLesson: "JavaScript ES6 Features",
    thumbnail: "/web-development-course.png",
  },
  {
    id: 3,
    title: "Data Science Bootcamp",
    teacher: "Dr. Emily Rodriguez",
    progress: 92,
    nextLesson: "Final Project Review",
    thumbnail: "/data-science-course.png",
  },
]

const aiSuggestions = [
  {
    title: "Review Neural Networks",
    description: "You struggled with this topic last week. A quick review could help!",
    action: "Start Review",
  },
  {
    title: "Practice Quiz Available",
    description: "Test your knowledge on JavaScript fundamentals",
    action: "Take Quiz",
  },
  {
    title: "Study Group Forming",
    description: "3 students are studying ML Advanced tonight at 7 PM",
    action: "Join Group",
  },
]

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome Back!</h1>
        <p className="text-muted-foreground mt-1">Continue your learning journey</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Enrolled Courses" value="3" icon={BookOpen} description="Active learning paths" />
        <StatCard
          title="Average Score"
          value="85%"
          icon={Award}
          trend={{ value: "5% from last month", positive: true }}
        />
        <StatCard title="Study Streak" value="12 days" icon={Flame} description="Keep it up!" />
        <StatCard title="Hours Learned" value="47h" icon={Clock} description="This month" />
      </div>

      {/* Continue Learning */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Continue Learning</h2>
          <Button variant="outline" size="sm">
            View All Courses
          </Button>
        </div>
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
                  <Button size="lg" className="gap-2">
                    <Play className="w-5 h-5" />
                    Continue
                  </Button>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold line-clamp-1">{course.title}</h3>
                  <p className="text-sm text-muted-foreground">by {course.teacher}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} />
                </div>
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground">Next: {course.nextLesson}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">AI Study Suggestions</h3>
            </div>
            <div className="space-y-3">
              {aiSuggestions.map((suggestion, index) => (
                <div key={index} className="p-3 rounded-lg bg-muted/50 border border-border space-y-2">
                  <p className="font-medium text-sm">{suggestion.title}</p>
                  <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                  <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                    {suggestion.action}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Recent Achievements</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Course Completed</p>
                  <p className="text-xs text-muted-foreground">Finished Data Science Bootcamp</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/10 border border-accent/20">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">12 Day Streak</p>
                  <p className="text-xs text-muted-foreground">Studied every day this week</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-chart-2/10 border border-chart-2/20">
                <div className="w-12 h-12 rounded-full bg-chart-2/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-chart-2" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Top Performer</p>
                  <p className="text-xs text-muted-foreground">Ranked #3 in ML Advanced</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
