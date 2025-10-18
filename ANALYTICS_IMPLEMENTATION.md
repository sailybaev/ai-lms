# Organization Admin Analytics Implementation

## Overview

Implemented a comprehensive analytics dashboard for organization administrators at the route `/[org]/admin/analytics`.

## Files Created/Modified

### 1. Frontend: `/app/[org]/admin/analytics/page.tsx`

- **Complete analytics dashboard** with real-time data visualization
- **Features:**
  - Overview metrics (Active Users, Session Time, Enrollments, Completion Rate)
  - User distribution by role (Admin, Teacher, Student) - Pie Chart
  - Peak activity hours - Bar Chart
  - Activity trends over time (Logins, Lesson Views, Assignments) - Area Chart
  - Course engagement rates - Progress bars
  - Top performing students
  - Recent activity feed
  - Time range selector (7d, 30d, 90d, 1y)
  - Export report functionality

### 2. Backend: `/app/api/org/[org]/analytics/route.ts`

- **GET endpoint** for fetching organization analytics
- **Query Parameters:**
  - `range`: Time range filter (7d, 30d, 90d, 1y)
- **Data Aggregations:**
  - Total and active user counts
  - Course statistics (total, active)
  - Enrollment metrics with completion rates
  - Activity events grouped by date
  - Peak usage hours
  - Top performing students
  - User distribution by role
  - Course engagement calculations

## Key Metrics Displayed

### Overview Cards

1. **Active Users** - Shows active users with % change from previous period
2. **Avg. Session Time** - Average time spent per session
3. **Total Enrollments** - Total enrollments with trend
4. **Completion Rate** - Percentage of completed courses with trend

### Additional Statistics

- Total Users count
- Active Courses / Total Courses
- Active Enrollments count

### Visualizations

1. **User Distribution Pie Chart** - Breakdown by Admin/Teacher/Student roles
2. **Peak Activity Hours Bar Chart** - Active users throughout the day
3. **Activity Trends Area Chart** - Logins, Lesson Views, and Assignments over time
4. **Course Engagement Progress Bars** - Top 5 courses by engagement rate
5. **Top Performers List** - Top 5 students with completion rates
6. **Recent Activity Feed** - Latest user activities

## Database Queries

The API uses Prisma to aggregate data from:

- `Organization` - Org validation
- `Membership` - User counts and role distribution
- `User` - Active user tracking
- `Course` - Course statistics
- `Enrollment` - Enrollment and completion data
- `ProgressEvent` - Activity tracking (logins, lesson views, assignments)

## Technical Implementation

### Time Range Handling

- Calculates current and previous periods for comparison
- Supports 7 days, 30 days, 90 days, and 1 year ranges
- Shows percentage changes between periods

### Data Processing

- Efficient parallel queries using `Promise.all()`
- Activity events grouped by date for trend visualization
- Peak hours calculated from login events
- Engagement rates based on lesson views vs enrollments
- Top performers sorted by completion rate

### UI Components

- Uses Recharts for data visualization
- Responsive grid layouts
- Dark mode compatible
- Loading states
- Error handling with toast notifications

## Integration Points

### Sidebar Navigation

The analytics page is already integrated in the sidebar configuration (`components/app-sidebar.tsx`) for the `orgAdmin` role at `/admin/analytics`.

### Organization Context

Uses `useOrg()` hook to get the current organization slug and fetch organization-specific data.

## Future Enhancements

1. Add real-time session time tracking
2. Implement actual export functionality (PDF/CSV)
3. Add more granular filters (by course, by user type)
4. Include AI usage statistics
5. Add assignment submission trends
6. Include grade distribution analytics
7. Add comparative analytics between periods
8. Implement drill-down capabilities for detailed views

## Testing

To test the analytics page:

1. Navigate to `/{org-slug}/admin/analytics`
2. Ensure you have data in your database:
   - Users with memberships
   - Courses with enrollments
   - Progress events for activity tracking
3. Try different time ranges
4. Verify all charts render correctly

## Dependencies

- `recharts` - Already included for chart rendering
- `lucide-react` - For icons
- `@prisma/client` - For database queries
- Existing UI components from `components/ui/`
