// Mock data generators for development and testing

export function generateMockUsers(count: number) {
  const roles = ["student", "teacher", "admin"]
  const statuses = ["active", "inactive", "suspended"]
  const names = [
    "Alice Johnson",
    "Bob Smith",
    "Carol White",
    "David Brown",
    "Emma Davis",
    "Frank Miller",
    "Grace Lee",
    "Henry Wilson",
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: `user-${i + 1}`,
    name: names[i % names.length],
    email: `user${i + 1}@example.com`,
    role: roles[Math.floor(Math.random() * roles.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    joinedDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    lastActive: new Date(2025, 0, Math.floor(Math.random() * 15) + 1),
  }))
}

export function generateMockCourses(count: number) {
  const titles = [
    "Advanced Machine Learning",
    "Web Development Fundamentals",
    "Data Science Bootcamp",
    "Mobile App Design",
    "Cloud Computing Essentials",
    "Cybersecurity Fundamentals",
  ]

  const teachers = ["Dr. Sarah Chen", "Prof. Michael Brown", "Dr. Emily Rodriguez", "Prof. James Wilson"]

  return Array.from({ length: count }, (_, i) => ({
    id: `course-${i + 1}`,
    title: titles[i % titles.length],
    teacher: teachers[Math.floor(Math.random() * teachers.length)],
    students: Math.floor(Math.random() * 100) + 20,
    duration: `${Math.floor(Math.random() * 8) + 4} weeks`,
    progress: Math.floor(Math.random() * 100),
    rating: (Math.random() * 1.5 + 3.5).toFixed(1),
    status: Math.random() > 0.2 ? "active" : "pending",
  }))
}

export function generateMockAssignments(count: number) {
  const titles = [
    "Neural Network Implementation",
    "Build a React Component Library",
    "Data Analysis Project",
    "Backpropagation Algorithm",
    "JavaScript ES6 Quiz",
  ]

  const courses = ["Advanced Machine Learning", "Web Development Fundamentals", "Data Science Bootcamp"]

  const statuses = ["pending", "submitted", "graded"]

  return Array.from({ length: count }, (_, i) => ({
    id: `assignment-${i + 1}`,
    title: titles[i % titles.length],
    course: courses[Math.floor(Math.random() * courses.length)],
    dueDate: new Date(2025, 0, Math.floor(Math.random() * 30) + 1).toISOString().split("T")[0],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    grade: Math.random() > 0.5 ? Math.floor(Math.random() * 30) + 70 : null,
  }))
}

export function generateMockAnalytics() {
  return {
    userGrowth: Array.from({ length: 6 }, (_, i) => ({
      month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i],
      users: Math.floor(Math.random() * 200) + 100 + i * 50,
    })),
    dailyEngagement: Array.from({ length: 7 }, (_, i) => ({
      day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
      active: Math.floor(Math.random() * 200) + 250,
    })),
    coursePerformance: Array.from({ length: 5 }, (_, i) => ({
      course: `Course ${i + 1}`,
      score: Math.floor(Math.random() * 30) + 70,
      engagement: Math.floor(Math.random() * 30) + 60,
    })),
  }
}
