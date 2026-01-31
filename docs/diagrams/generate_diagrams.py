#!/usr/bin/env python3
"""Generate flowchart diagrams for EduAI LMS"""

from graphviz import Digraph
import os

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))


# ---------------- AUTH FLOW ----------------
def create_auth_flow():
    dot = Digraph('auth_flow', format='png')
    dot.attr(rankdir='LR', bgcolor='white', fontname='Helvetica')
    dot.attr('node', shape='box', style='rounded,filled', fontname='Helvetica', fontsize='12')
    dot.attr('edge', fontname='Helvetica', fontsize='10')

    dot.node('start', 'User Visits\nApplication', fillcolor='#e3f2fd', color='#1976d2')
    dot.node('middleware', 'Middleware\nIntercepts Request', fillcolor='#fff3e0', color='#f57c00')
    dot.node('resolve', 'Resolve Domain\nto Organization', fillcolor='#fff3e0', color='#f57c00')
    dot.node('auth_check', 'Check\nSession Cookie', fillcolor='#fce4ec', color='#c2185b', shape='diamond')
    dot.node('login', 'Redirect to\nLogin Page', fillcolor='#ffebee', color='#d32f2f')
    dot.node('nextauth', 'NextAuth.js\nValidates Credentials', fillcolor='#e8f5e9', color='#388e3c')
    dot.node('jwt', 'Generate\nJWT Session', fillcolor='#e8f5e9', color='#388e3c')
    dot.node('role_check', 'Check User Role\nin Organization', fillcolor='#fff3e0', color='#f57c00')
    dot.node('admin_dash', 'Admin\nDashboard', fillcolor='#e1f5fe', color='#0288d1')
    dot.node('teacher_dash', 'Teacher\nDashboard', fillcolor='#f3e5f5', color='#7b1fa2')
    dot.node('student_dash', 'Student\nDashboard', fillcolor='#e8f5e9', color='#388e3c')

    dot.edge('start', 'middleware')
    dot.edge('middleware', 'resolve')
    dot.edge('resolve', 'auth_check')
    dot.edge('auth_check', 'login', label='No Session')
    dot.edge('auth_check', 'role_check', label='Valid Session')
    dot.edge('login', 'nextauth')
    dot.edge('nextauth', 'jwt', label='Success')
    dot.edge('jwt', 'role_check')
    dot.edge('role_check', 'admin_dash', label='Admin')
    dot.edge('role_check', 'teacher_dash', label='Teacher')
    dot.edge('role_check', 'student_dash', label='Student')

    dot.render(os.path.join(OUTPUT_DIR, '1_authentication_flow'), cleanup=True)


# ---------------- ROLE HIERARCHY ----------------
def create_role_hierarchy():
    dot = Digraph('role_hierarchy', format='png')
    dot.attr(rankdir='LR', bgcolor='white', fontname='Helvetica')
    dot.attr('node', shape='box', style='rounded,filled', fontname='Helvetica', fontsize='12')

    dot.node('superadmin',
             'Super Admin\n━━━━━━━━━━\n• Platform Management\n• All Organizations\n• Global Users\n• System Settings',
             fillcolor='#ffcdd2', color='#d32f2f')

    with dot.subgraph(name='cluster_org') as c:
        c.attr(label='Organization Scope', style='dashed', color='#9e9e9e')
        c.node('admin',
               'Admin\n━━━━━━━━━━\n• Manage Users\n• Manage Courses\n• Manage Groups\n• Organization Settings',
               fillcolor='#e1f5fe', color='#0288d1')
        c.node('teacher',
               'Teacher\n━━━━━━━━━━\n• Create Courses\n• Grade Assignments\n• View Analytics\n• Manage Students',
               fillcolor='#f3e5f5', color='#7b1fa2')
        c.node('student',
               'Student\n━━━━━━━━━━\n• Access Courses\n• Submit Assignments\n• Use AI Assistant\n• Track Progress',
               fillcolor='#e8f5e9', color='#388e3c')

    dot.edge('superadmin', 'admin', label='Manages')
    dot.edge('admin', 'teacher', label='Manages', constraint='false')
    dot.edge('admin', 'student', label='Manages', constraint='false')
    dot.edge('teacher', 'student', label='Teaches', constraint='false')

    dot.render(os.path.join(OUTPUT_DIR, '2_role_hierarchy'), cleanup=True)


# ---------------- COURSE MANAGEMENT ----------------
def create_course_management():
    dot = Digraph('course_flow', format='png')
    dot.attr(rankdir='LR', bgcolor='white', fontname='Helvetica')
    dot.attr('node', shape='box', style='rounded,filled', fontname='Helvetica', fontsize='11')
    dot.attr('edge', fontname='Helvetica', fontsize='9')

    with dot.subgraph(name='cluster_create') as c:
        c.attr(label='Course Creation', style='filled', color='#e3f2fd', fontcolor='#1565c0')
        c.node('create', 'Teacher Creates\nCourse', fillcolor='#bbdefb', color='#1976d2')
        c.node('sections', 'Add Sections', fillcolor='#bbdefb', color='#1976d2')
        c.node('lessons', 'Add Lessons\n& Content', fillcolor='#bbdefb', color='#1976d2')
        c.node('assignments', 'Create\nAssignments', fillcolor='#bbdefb', color='#1976d2')

    with dot.subgraph(name='cluster_status') as c:
        c.attr(label='Course Status', style='filled', color='#fff3e0', fontcolor='#e65100')
        c.node('draft', 'Draft', fillcolor='#ffe0b2', color='#f57c00')
        c.node('active', 'Active', fillcolor='#c8e6c9', color='#388e3c')
        c.node('archived', 'Archived', fillcolor='#cfd8dc', color='#607d8b')

    with dot.subgraph(name='cluster_student') as c:
        c.attr(label='Student Learning', style='filled', color='#e8f5e9', fontcolor='#2e7d32')
        c.node('enroll', 'Student\nEnrolls', fillcolor='#a5d6a7', color='#43a047')
        c.node('learn', 'Access\nLessons', fillcolor='#a5d6a7', color='#43a047')
        c.node('submit', 'Submit\nAssignments', fillcolor='#a5d6a7', color='#43a047')
        c.node('progress', 'Track\nProgress', fillcolor='#a5d6a7', color='#43a047')

    with dot.subgraph(name='cluster_grade') as c:
        c.attr(label='Grading', style='filled', color='#f3e5f5', fontcolor='#6a1b9a')
        c.node('review', 'Teacher\nReviews', fillcolor='#ce93d8', color='#8e24aa')
        c.node('grade', 'Grade &\nFeedback', fillcolor='#ce93d8', color='#8e24aa')

    dot.edge('create', 'sections')
    dot.edge('sections', 'lessons')
    dot.edge('lessons', 'assignments')
    dot.edge('assignments', 'draft')
    dot.edge('draft', 'active', label='Publish')
    dot.edge('active', 'archived', label='Archive')
    dot.edge('active', 'enroll')
    dot.edge('enroll', 'learn')
    dot.edge('learn', 'submit')
    dot.edge('submit', 'progress')
    dot.edge('submit', 'review')
    dot.edge('review', 'grade')
    dot.edge('grade', 'progress')

    dot.render(os.path.join(OUTPUT_DIR, '3_course_management'), cleanup=True)


# ---------------- AI ASSISTANT FLOW ----------------
def create_ai_assistant_flow():
    dot = Digraph('ai_flow', format='png')
    dot.attr(rankdir='LR', bgcolor='white', fontname='Helvetica')
    dot.attr('node', shape='box', style='rounded,filled', fontname='Helvetica', fontsize='11')
    dot.attr('edge', fontname='Helvetica', fontsize='9')

    dot.node('student', 'Student', fillcolor='#e8f5e9', color='#388e3c', shape='ellipse')
    dot.node('question', 'Ask Question', fillcolor='#e3f2fd', color='#1976d2')

    with dot.subgraph(name='cluster_context') as c:
        c.attr(label='Context Gathering', style='filled', color='#fff8e1', fontcolor='#f57f17')
        c.node('session', 'Get/Create\nChat Session', fillcolor='#ffecb3', color='#ffa000')
        c.node('course_ctx', 'Load Course\nContext', fillcolor='#ffecb3', color='#ffa000')
        c.node('lesson_ctx', 'Load Lesson\nContext', fillcolor='#ffecb3', color='#ffa000')
        c.node('history', 'Load Chat\nHistory', fillcolor='#ffecb3', color='#ffa000')

    with dot.subgraph(name='cluster_ai') as c:
        c.attr(label='OpenAI API', style='filled', color='#e8eaf6', fontcolor='#283593')
        c.node('prompt', 'Build Prompt\nwith Context', fillcolor='#c5cae9', color='#3f51b5')
        c.node('openai', 'OpenAI\nGPT Model', fillcolor='#9fa8da', color='#303f9f', shape='cylinder')
        c.node('response', 'Generate\nResponse', fillcolor='#c5cae9', color='#3f51b5')

    dot.node('save', 'Save to\nAIMessage', fillcolor='#f3e5f5', color='#7b1fa2')
    dot.node('display', 'Display\nResponse', fillcolor='#e8f5e9', color='#388e3c')
    dot.node('analytics', 'Log AI\nUsage Event', fillcolor='#fce4ec', color='#c2185b')

    dot.edge('student', 'question')
    dot.edge('question', 'session')
    dot.edge('session', 'course_ctx')
    dot.edge('session', 'lesson_ctx')
    dot.edge('session', 'history')
    dot.edge('course_ctx', 'prompt')
    dot.edge('lesson_ctx', 'prompt')
    dot.edge('history', 'prompt')
    dot.edge('prompt', 'openai')
    dot.edge('openai', 'response')
    dot.edge('response', 'save')
    dot.edge('save', 'display')
    dot.edge('save', 'analytics')
    dot.edge('display', 'student', constraint='false')

    dot.render(os.path.join(OUTPUT_DIR, '4_ai_assistant_flow'), cleanup=True)
# ---------------- MULTI TENANCY ----------------
def create_multi_tenancy():
    dot = Digraph('multitenancy', format='png')
    dot.attr(rankdir='LR', bgcolor='white', fontname='Helvetica', compound='true')
    dot.attr('node', shape='box', style='rounded,filled', fontname='Helvetica', fontsize='11')

    dot.node('req1', 'acme.edu\n(Custom Domain)', fillcolor='#e3f2fd', color='#1976d2')
    dot.node('req2', 'school.eduai.com\n(Subdomain)', fillcolor='#e3f2fd', color='#1976d2')
    dot.node('req3', 'localhost/org-slug\n(Path-based)', fillcolor='#e3f2fd', color='#1976d2')

    dot.node('middleware',
             'Middleware\n━━━━━━━━━━━━━━\nDomain Resolution\nSession Validation\nURL Rewriting',
             fillcolor='#fff3e0', color='#f57c00')

    dot.node('lookup', 'OrganizationDomain\nLookup',
             fillcolor='#fce4ec', color='#c2185b', shape='cylinder')

    with dot.subgraph(name='cluster_orgs') as c:
        c.attr(label='Isolated Organizations', style='dashed', color='#9e9e9e')

        with c.subgraph(name='cluster_org1') as o:
            o.attr(label='Organization A', style='filled', color='#e8f5e9')
            o.node('org1_users', 'Users', fillcolor='#c8e6c9', color='#388e3c')
            o.node('org1_courses', 'Courses', fillcolor='#c8e6c9', color='#388e3c')
            o.node('org1_data', 'Data', fillcolor='#c8e6c9', color='#388e3c')

        with c.subgraph(name='cluster_org2') as o:
            o.attr(label='Organization B', style='filled', color='#e1f5fe')
            o.node('org2_users', 'Users', fillcolor='#b3e5fc', color='#0288d1')
            o.node('org2_courses', 'Courses', fillcolor='#b3e5fc', color='#0288d1')
            o.node('org2_data', 'Data', fillcolor='#b3e5fc', color='#0288d1')

        with c.subgraph(name='cluster_org3') as o:
            o.attr(label='Organization C', style='filled', color='#f3e5f5')
            o.node('org3_users', 'Users', fillcolor='#e1bee7', color='#7b1fa2')
            o.node('org3_courses', 'Courses', fillcolor='#e1bee7', color='#7b1fa2')
            o.node('org3_data', 'Data', fillcolor='#e1bee7', color='#7b1fa2')

    dot.node('db', 'PostgreSQL\nDatabase', fillcolor='#eceff1', color='#455a64', shape='cylinder')

    dot.edge('req1', 'middleware')
    dot.edge('req2', 'middleware')
    dot.edge('req3', 'middleware')
    dot.edge('middleware', 'lookup')

    dot.edge('lookup', 'org1_users', lhead='cluster_org1')
    dot.edge('lookup', 'org2_users', lhead='cluster_org2')
    dot.edge('lookup', 'org3_users', lhead='cluster_org3')

    # keep DB horizontal
    dot.edge('org1_data', 'db', constraint='false')
    dot.edge('org2_data', 'db', constraint='false')
    dot.edge('org3_data', 'db', constraint='false')

    dot.render(os.path.join(OUTPUT_DIR, '5_multi_tenancy'), cleanup=True)


# ---------------- DATABASE SCHEMA ----------------
def create_database_schema():
    dot = Digraph('db_schema', format='png')
    dot.attr(rankdir='LR', bgcolor='white', fontname='Helvetica', splines='ortho')
    dot.attr('node', shape='record', style='filled', fontname='Helvetica', fontsize='10')
    dot.attr('edge', fontname='Helvetica', fontsize='8')

    dot.node('org',
             '''Organization| id: UUID\l slug: String\l name: String\l logoUrl: String?\l settings: JSON?\l platformName: String?\l ''',
             fillcolor='#e3f2fd', color='#1976d2')

    dot.node('user',
             '''User| id: UUID\l email: String\l name: String\l avatarUrl: String?\l passwordHash: String?\l isSuperAdmin: Boolean\l ''',
             fillcolor='#e8f5e9', color='#388e3c')

    dot.node('membership',
             '''Membership| id: UUID\l orgId: UUID\l userId: UUID\l role: Role\l status: Status\l ''',
             fillcolor='#fff3e0', color='#f57c00')

    dot.node('course',
             '''Course| id: UUID\l orgId: UUID\l title: String\l description: String?\l status: CourseStatus\l createdById: UUID\l ''',
             fillcolor='#f3e5f5', color='#7b1fa2')

    dot.node('section',
             '''CourseSection| id: UUID\l courseId: UUID\l title: String\l position: Int\l ''',
             fillcolor='#fce4ec', color='#c2185b')

    dot.node('lesson',
             '''Lesson| id: UUID\l sectionId: UUID\l title: String\l content: JSON?\l videoUrl: String?\l position: Int\l ''',
             fillcolor='#ffebee', color='#d32f2f')

    dot.node('enrollment',
             '''Enrollment| id: UUID\l orgId: UUID\l courseId: UUID\l userId: UUID\l status: Status\l ''',
             fillcolor='#e1f5fe', color='#0288d1')

    dot.node('assignment',
             '''Assignment| id: UUID\l orgId: UUID\l courseId: UUID\l title: String\l type: AssignmentType\l dueAt: DateTime?\l maxPoints: Int?\l ''',
             fillcolor='#e0f2f1', color='#00796b')

    dot.node('ai_session',
             '''AIChatSession| id: UUID\l orgId: UUID\l userId: UUID\l courseId: UUID?\l lessonId: UUID?\l title: String?\l ''',
             fillcolor='#fff8e1', color='#f9a825')

    dot.edge('org', 'membership', label='1:N')
    dot.edge('user', 'membership', label='1:N')
    dot.edge('org', 'course', label='1:N')
    dot.edge('course', 'section', label='1:N')
    dot.edge('section', 'lesson', label='1:N')
    dot.edge('course', 'enrollment', label='1:N')
    dot.edge('user', 'enrollment', label='1:N')
    dot.edge('course', 'assignment', label='1:N')
    dot.edge('user', 'ai_session', label='1:N')
    dot.edge('course', 'ai_session', label='1:N', style='dashed')

    dot.render(os.path.join(OUTPUT_DIR, '6_database_schema'), cleanup=True)


if __name__ == '__main__':
    print("Generating EduAI diagrams...\n")
    create_auth_flow()
    create_role_hierarchy()
    create_course_management()
    create_ai_assistant_flow()
    create_multi_tenancy()
    create_database_schema()
    print(f"\n✅ All diagrams saved to: {OUTPUT_DIR}")
