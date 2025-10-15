// Analytics utilities for tracking and reporting

export interface UserAnalytics {
  userId: string
  totalCourses: number
  completedCourses: number
  averageScore: number
  totalStudyTime: number
  streakDays: number
  lastActive: Date
}

export interface CourseAnalytics {
  courseId: string
  totalStudents: number
  activeStudents: number
  completionRate: number
  averageScore: number
  averageTimeSpent: number
  engagementRate: number
}

export interface PlatformAnalytics {
  totalUsers: number
  activeUsers: number
  totalCourses: number
  activeCourses: number
  averageCompletionRate: number
  averageEngagement: number
  growthRate: number
}

/**
 * Calculate user analytics
 */
export function calculateUserAnalytics(userData: {
  enrolledCourses: Array<{ completed: boolean; score: number; timeSpent: number }>
  lastActiveDates: Date[]
}): UserAnalytics {
  const completedCourses = userData.enrolledCourses.filter((c) => c.completed).length
  const totalScore = userData.enrolledCourses.reduce((sum, c) => sum + c.score, 0)
  const averageScore = userData.enrolledCourses.length > 0 ? totalScore / userData.enrolledCourses.length : 0
  const totalStudyTime = userData.enrolledCourses.reduce((sum, c) => sum + c.timeSpent, 0)

  // Calculate streak
  let streakDays = 0
  const sortedDates = userData.lastActiveDates.sort((a, b) => b.getTime() - a.getTime())
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < sortedDates.length; i++) {
    const date = new Date(sortedDates[i])
    date.setHours(0, 0, 0, 0)
    const expectedDate = new Date(today)
    expectedDate.setDate(today.getDate() - i)

    if (date.getTime() === expectedDate.getTime()) {
      streakDays++
    } else {
      break
    }
  }

  return {
    userId: "user-123",
    totalCourses: userData.enrolledCourses.length,
    completedCourses,
    averageScore: Math.round(averageScore),
    totalStudyTime,
    streakDays,
    lastActive: sortedDates[0] || new Date(),
  }
}

/**
 * Calculate course analytics
 */
export function calculateCourseAnalytics(courseData: {
  students: Array<{
    completed: boolean
    score: number
    timeSpent: number
    lastActive: Date
  }>
}): CourseAnalytics {
  const totalStudents = courseData.students.length
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const activeStudents = courseData.students.filter((s) => s.lastActive > weekAgo).length
  const completedStudents = courseData.students.filter((s) => s.completed).length
  const completionRate = totalStudents > 0 ? (completedStudents / totalStudents) * 100 : 0

  const totalScore = courseData.students.reduce((sum, s) => sum + s.score, 0)
  const averageScore = totalStudents > 0 ? totalScore / totalStudents : 0

  const totalTime = courseData.students.reduce((sum, s) => sum + s.timeSpent, 0)
  const averageTimeSpent = totalStudents > 0 ? totalTime / totalStudents : 0

  const engagementRate = totalStudents > 0 ? (activeStudents / totalStudents) * 100 : 0

  return {
    courseId: "course-123",
    totalStudents,
    activeStudents,
    completionRate: Math.round(completionRate),
    averageScore: Math.round(averageScore),
    averageTimeSpent: Math.round(averageTimeSpent),
    engagementRate: Math.round(engagementRate),
  }
}

/**
 * Calculate platform-wide analytics
 */
export function calculatePlatformAnalytics(data: {
  users: Array<{ active: boolean; lastActive: Date }>
  courses: Array<{ active: boolean; students: number }>
  historicalData: {
    previousMonthUsers: number
    currentMonthUsers: number
  }
}): PlatformAnalytics {
  const totalUsers = data.users.length
  const activeUsers = data.users.filter((u) => u.active).length

  const totalCourses = data.courses.length
  const activeCourses = data.courses.filter((c) => c.active).length

  const growthRate =
    data.historicalData.previousMonthUsers > 0
      ? ((data.historicalData.currentMonthUsers - data.historicalData.previousMonthUsers) /
          data.historicalData.previousMonthUsers) *
        100
      : 0

  return {
    totalUsers,
    activeUsers,
    totalCourses,
    activeCourses,
    averageCompletionRate: 68, // Mock value
    averageEngagement: 75, // Mock value
    growthRate: Math.round(growthRate),
  }
}

/**
 * Generate analytics report
 */
export function generateAnalyticsReport(analytics: PlatformAnalytics): string {
  return `Platform Analytics Report
Generated: ${new Date().toLocaleDateString()}

Overview:
- Total Users: ${analytics.totalUsers}
- Active Users: ${analytics.activeUsers} (${Math.round((analytics.activeUsers / analytics.totalUsers) * 100)}%)
- Total Courses: ${analytics.totalCourses}
- Active Courses: ${analytics.activeCourses}

Performance Metrics:
- Average Completion Rate: ${analytics.averageCompletionRate}%
- Average Engagement: ${analytics.averageEngagement}%
- Growth Rate: ${analytics.growthRate > 0 ? "+" : ""}${analytics.growthRate}%

Insights:
${analytics.growthRate > 10 ? "✓ Strong user growth" : "• Moderate growth"}
${analytics.averageEngagement > 70 ? "✓ High engagement levels" : "• Engagement needs improvement"}
${analytics.averageCompletionRate > 60 ? "✓ Good completion rates" : "• Focus on improving completion"}

Recommendations:
${analytics.averageEngagement < 70 ? "- Increase interactive content and gamification" : ""}
${analytics.averageCompletionRate < 60 ? "- Review course difficulty and pacing" : ""}
${analytics.growthRate < 5 ? "- Implement user acquisition strategies" : ""}
`
}

/**
 * Track event for analytics
 */
export function trackEvent(eventName: string, properties?: Record<string, string | number | boolean>): void {
  // In production, this would send to an analytics service
  console.log("[Analytics]", eventName, properties)
}

/**
 * Format duration in hours and minutes
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours === 0) {
    return `${mins}m`
  }
  if (mins === 0) {
    return `${hours}h`
  }
  return `${hours}h ${mins}m`
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(
  current: number,
  previous: number,
): {
  value: number
  positive: boolean
} {
  if (previous === 0) {
    return { value: 100, positive: current > 0 }
  }

  const change = ((current - previous) / previous) * 100
  return {
    value: Math.abs(Math.round(change)),
    positive: change >= 0,
  }
}
