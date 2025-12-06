# EduAI - AI-Powered Learning Management System

A modern, comprehensive Learning Management System with AI-powered features for administrators, teachers, and students.

## Features

### For Administrators
- **Dashboard**: Overview of platform metrics and KPIs
- **User Management**: Manage students, teachers, and admins
- **Course Oversight**: Monitor and approve courses
- **Analytics**: Detailed platform-wide insights
- **AI Tools**: Generate reports and detect anomalies

### For Teachers
- **Course Management**: Create and manage courses
- **Student Tracking**: Monitor student progress and performance
- **AI Tools**: Generate quizzes, summaries, and topic suggestions
- **Analytics**: Course-specific performance metrics
- **Communication**: Email and message students

### For Students
- **Course Browser**: Enroll in and access courses
- **AI Assistant**: Get instant help with studies
- **Progress Tracking**: Monitor learning journey
- **Assignments**: Submit and track assignments
- **Achievements**: Earn badges and track streaks

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **Fonts**: Geist Sans & Geist Mono
- **Analytics**: Vercel Analytics

## AI Integration

The platform includes AI-powered features:
- Quiz generation from lesson content
- Lesson summarization
- Topic suggestions
- Study recommendations
- Anomaly detection
- Interactive AI chat assistant

## Getting Started

### Quick Start with Docker (Recommended)

1. **Start the application**:
   \`\`\`bash
   docker-compose up -d
   \`\`\`

2. **Run database migrations**:
   \`\`\`bash
   npm run prisma:migrate
   \`\`\`

3. **Access the application**: http://localhost:3000

For detailed Docker documentation, see [DOCKER.md](./DOCKER.md).

### Local Development Setup

1. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

2. **Configure environment**:
   \`\`\`bash
   cp .env.example .env
   # Update DATABASE_URL to your local PostgreSQL
   \`\`\`

3. **Run database migrations**:
   \`\`\`bash
   npm run prisma:migrate
   \`\`\`

4. **Start development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Access the application**: http://localhost:3000

## Project Structure

\`\`\`
├── app/
│   ├── admin/          # Admin dashboard and pages
│   ├── teacher/        # Teacher dashboard and pages
│   ├── student/        # Student dashboard and pages
│   └── page.tsx        # Landing page
├── components/
│   ├── ui/             # shadcn/ui components
│   ├── app-sidebar.tsx # Role-based sidebar
│   └── ...             # Other shared components
├── lib/
│   ├── ai.ts           # AI integration utilities
│   ├── analytics.ts    # Analytics functions
│   └── utils.ts        # Utility functions
└── public/             # Static assets
\`\`\`

## Design System

- **Colors**: Blue primary with dark theme
- **Typography**: Geist Sans for UI, Geist Mono for code
- **Spacing**: Consistent 4px grid system
- **Radius**: 12px default border radius
- **Animations**: Subtle transitions and hover effects

## License

MIT
