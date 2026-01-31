# EduAI - AI-Powered Learning Management System

## Project Overview

EduAI is a modern, multi-tenant Learning Management System (LMS) designed to enhance the educational experience through artificial intelligence. The platform enables educational institutions to create, manage, and deliver courses while leveraging AI capabilities to provide personalized learning assistance to students.

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.2.4 | React framework with App Router for server-side rendering and routing |
| **React** | 19 | UI component library |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **Tailwind CSS** | 4.x | Utility-first CSS framework |
| **Radix UI** | Latest | Accessible, unstyled UI primitives (shadcn/ui pattern) |
| **Lucide React** | 0.454 | Icon library |
| **Recharts** | Latest | Data visualization and charts |
| **React Hook Form** | 7.60 | Form state management |
| **Zod** | 3.25 | Schema validation |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js API Routes** | 15.2.4 | Serverless API endpoints |
| **Prisma ORM** | 6.17 | Database toolkit and ORM |
| **PostgreSQL** | - | Relational database |
| **NextAuth.js** | 4.24 | Authentication and session management |
| **bcryptjs** | 2.4 | Password hashing |

### AI Integration
| Technology | Purpose |
|------------|---------|
| **OpenAI API** | AI-powered chat assistant, content generation, and intelligent tutoring |

### Testing
| Technology | Version | Purpose |
|------------|---------|---------|
| **Jest** | 30.2 | Testing framework |
| **Testing Library** | 16.3 | React component testing |
| **jest-mock-extended** | 4.0 | Advanced mocking utilities |

### DevOps & Tools
| Technology | Purpose |
|------------|---------|
| **Vercel Analytics** | Performance and usage analytics |
| **ESLint** | Code linting |
| **PostCSS** | CSS processing |

## System Architecture

### Multi-Tenancy Model

EduAI implements a robust multi-tenant architecture where each organization operates as an isolated tenant:

```
┌─────────────────────────────────────────────────────────────────┐
│                        EduAI Platform                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Organization │  │ Organization │  │ Organization │   ...    │
│  │      A       │  │      B       │  │      C       │          │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤          │
│  │ - Users      │  │ - Users      │  │ - Users      │          │
│  │ - Courses    │  │ - Courses    │  │ - Courses    │          │
│  │ - Groups     │  │ - Groups     │  │ - Groups     │          │
│  │ - Settings   │  │ - Settings   │  │ - Settings   │          │
│  │ - Branding   │  │ - Branding   │  │ - Branding   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

**Key Features:**
- **Custom Domains**: Each organization can configure custom domains
- **Isolated Data**: Complete data separation between tenants
- **Custom Branding**: Organizations can customize their platform appearance
- **Independent Settings**: Per-organization configuration

### Role-Based Access Control (RBAC)

The system implements four distinct user roles:

| Role | Description | Capabilities |
|------|-------------|--------------|
| **Super Admin** | Platform administrator | Manage all organizations, users, and platform settings |
| **Admin** | Organization administrator | Manage organization users, courses, groups, and settings |
| **Teacher** | Course instructor | Create/manage courses, grade assignments, view analytics |
| **Student** | Learner | Access courses, submit assignments, use AI assistant |

### Application Structure

```
app/
├── [org]/                      # Organization-scoped routes
│   ├── admin/                  # Admin dashboard
│   │   ├── courses/            # Course management
│   │   ├── users/              # User management
│   │   ├── groups/             # Group management
│   │   ├── analytics/          # Organization analytics
│   │   └── settings/           # Organization settings
│   ├── teacher/                # Teacher dashboard
│   │   ├── courses/            # Course creation & management
│   │   ├── students/           # Student progress tracking
│   │   ├── groups/             # Group management
│   │   └── analytics/          # Teaching analytics
│   ├── student/                # Student dashboard
│   │   ├── courses/            # Course enrollment & learning
│   │   ├── assignments/        # Assignment submissions
│   │   ├── progress/           # Learning progress
│   │   ├── ai-assistant/       # AI-powered learning assistant
│   │   └── profile/            # User profile
│   └── login/                  # Organization login
├── superadmin/                 # Platform administration
│   ├── organizations/          # Organization management
│   ├── users/                  # Global user management
│   └── admins/                 # Admin assignment
└── api/                        # API endpoints
    ├── auth/                   # Authentication
    ├── org/[org]/              # Organization-scoped APIs
    └── superadmin/             # Platform management APIs
```

## Database Schema

### Core Entities

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│  Organization   │       │      User       │       │   Membership    │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id              │       │ id              │       │ id              │
│ slug            │◄──────│ email           │◄──────│ orgId           │
│ name            │       │ name            │       │ userId          │
│ logoUrl         │       │ avatarUrl       │       │ role            │
│ settings        │       │ passwordHash    │       │ status          │
│ platformName    │       │ isSuperAdmin    │       └─────────────────┘
└─────────────────┘       └─────────────────┘
         │
         │
         ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     Course      │       │  CourseSection  │       │     Lesson      │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id              │──────►│ id              │──────►│ id              │
│ orgId           │       │ courseId        │       │ sectionId       │
│ title           │       │ title           │       │ title           │
│ description     │       │ position        │       │ content         │
│ status          │       └─────────────────┘       │ videoUrl        │
│ thumbnailUrl    │                                 │ duration        │
└─────────────────┘                                 └─────────────────┘
         │
         ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   Assignment    │       │   Submission    │       │     Grade       │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id              │──────►│ id              │──────►│ id              │
│ courseId        │       │ assignmentId    │       │ submissionId    │
│ title           │       │ userId          │       │ gradedById      │
│ description     │       │ content         │       │ score           │
│ dueAt           │       │ attachment      │       │ feedback        │
│ maxPoints       │       │ submittedAt     │       │ gradedAt        │
│ type            │       └─────────────────┘       └─────────────────┘
└─────────────────┘
```

### AI Features Schema

```
┌─────────────────┐       ┌─────────────────┐
│  AIChatSession  │       │    AIMessage    │
├─────────────────┤       ├─────────────────┤
│ id              │──────►│ id              │
│ orgId           │       │ sessionId       │
│ userId          │       │ sender          │
│ courseId        │       │ content         │
│ lessonId        │       │ tokens          │
│ title           │       │ createdAt       │
│ createdAt       │       └─────────────────┘
└─────────────────┘
```

## Key Features

### 1. Course Management
- Create and organize courses with sections and lessons
- Support for rich text content and video materials
- Draft, active, and archived course states
- Multiple instructors per course

### 2. Assignment & Grading System
- Multiple assignment types: essays, quizzes, projects
- File attachment support for submissions
- Detailed feedback with grades
- Due date tracking

### 3. Student Groups
- Organize students into groups
- Assign teachers to specific groups
- Course-specific or general groups

### 4. AI-Powered Learning Assistant
The AI assistant (powered by OpenAI API) provides:
- **Contextual Help**: Course and lesson-specific assistance
- **Personalized Learning**: Adapts to individual student needs
- **24/7 Availability**: Always available for student questions
- **Conversation History**: Maintains context across sessions

### 5. Analytics & Progress Tracking
- Track lesson views and completions
- Assignment completion rates
- AI usage statistics
- Login activity monitoring

### 6. User Profile Management
- Personal information management
- Avatar upload
- Password management
- Activity history

## Authentication Flow

```
┌──────────┐      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  Client  │      │  Middleware  │      │   NextAuth   │      │   Database   │
└────┬─────┘      └──────┬───────┘      └──────┬───────┘      └──────┬───────┘
     │                   │                     │                     │
     │  Request          │                     │                     │
     │──────────────────►│                     │                     │
     │                   │                     │                     │
     │                   │  Check Session      │                     │
     │                   │────────────────────►│                     │
     │                   │                     │                     │
     │                   │                     │  Validate JWT       │
     │                   │                     │────────────────────►│
     │                   │                     │                     │
     │                   │                     │◄────────────────────│
     │                   │◄────────────────────│                     │
     │                   │                     │                     │
     │                   │  Resolve Org        │                     │
     │                   │────────────────────────────────────────►  │
     │                   │                     │                     │
     │                   │◄──────────────────────────────────────────│
     │                   │                     │                     │
     │  Route to Org     │                     │                     │
     │◄──────────────────│                     │                     │
     │                   │                     │                     │
```

## Security Features

- **JWT-based Sessions**: Secure, stateless authentication
- **Password Hashing**: bcrypt with salt rounds
- **Role-based Authorization**: Granular access control
- **Organization Isolation**: Complete data separation
- **CSRF Protection**: Built-in NextAuth.js protection

## Deployment

The application is designed for deployment on:
- **Vercel**: Recommended for seamless Next.js deployment
- **Docker**: Containerized deployment support
- **Self-hosted**: Any Node.js compatible hosting


*EduAI - Empowering Education with Artificial Intelligence*
