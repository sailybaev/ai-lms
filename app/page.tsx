import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { GraduationCap, Users, BookOpen, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">EduAI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin">Admin</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/teacher">Teacher</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/student">Student</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered Learning
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
            Transform Education with <span className="text-primary">Intelligent Learning</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            A comprehensive learning management system powered by AI, designed for modern education with tools for
            students, teachers, and administrators.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" asChild>
              <Link href="/student">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Role Cards */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="p-6 space-y-4 hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Admin Dashboard</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Manage users, oversee courses, and gain insights with AI-powered analytics and reporting tools.
            </p>
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/admin">View Admin Panel</Link>
            </Button>
          </Card>

          <Card className="p-6 space-y-4 hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold">Teacher Tools</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Create engaging courses, generate quizzes with AI, and track student performance with detailed analytics.
            </p>
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/teacher">View Teacher Panel</Link>
            </Button>
          </Card>

          <Card className="p-6 space-y-4 hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-chart-2/10 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-chart-2" />
            </div>
            <h3 className="text-xl font-semibold">Student Learning</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Learn interactively with AI assistance, track progress, and get personalized study recommendations.
            </p>
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/student">View Student Panel</Link>
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">EduAI</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 EduAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
