# User Profile Setup - Quick Start Guide

## ✅ What Was Implemented

### 1. **Complete CRUD API** (`/app/api/org/[org]/profile/route.ts`)

- ✅ **CREATE**: Users created through registration system
- ✅ **READ**: GET endpoint to fetch user profile with stats
- ✅ **UPDATE**: PATCH endpoint to update name and avatar
- ✅ **DELETE**: DELETE endpoint to suspend membership

### 2. **Profile Page** (`/app/[org]/student/profile/page.tsx`)

- Server component that fetches data from database
- Displays user information, learning stats, enrolled courses
- Shows membership details and account creation date

### 3. **Profile Form** (`/components/profile-form.tsx`)

- Client component with real-time validation
- Updates profile through API
- Shows loading states and error messages
- Toast notifications for user feedback

### 4. **Helper Functions** (`/lib/user-profile.ts`)

- `getUserProfile()` - Fetch complete profile data
- `updateUserProfile()` - Update user information
- `checkUserMembership()` - Verify org membership
- `getUserActivity()` - Get recent activities
- `validateProfileUpdate()` - Validate input data

### 5. **Documentation** (`/docs/USER_PROFILE_SYSTEM.md`)

- Complete system documentation
- API reference with examples
- Usage guides and troubleshooting

## 🗄️ Database Integration

The system uses **Prisma ORM** with the following models:

```prisma
User {
  id, email, name, avatarUrl, passwordHash
  memberships[] → Membership
  enrollments[] → Enrollment
  progressEvents[] → ProgressEvent
}

Membership {
  user → User
  org → Organization
  role (admin/teacher/student)
  status (active/invited/suspended)
}

Enrollment {
  user → User
  course → Course
  status (active/completed/dropped)
}

ProgressEvent {
  user → User
  type (viewed_lesson/completed_assignment/login/ai_usage)
  occurredAt
}
```

## 🔐 Security Features

- ✅ NextAuth session validation
- ✅ Organization membership verification
- ✅ Input validation and sanitization
- ✅ Protected API routes
- ✅ Soft delete (membership suspension)

## 📊 What Users Can Do

1. **View Profile**: See their information, stats, and enrolled courses
2. **Update Profile**: Change name and avatar URL
3. **Track Progress**: View learning statistics
   - Courses enrolled
   - Assignments completed
   - Lessons viewed
   - AI usage count
4. **Manage Membership**: Leave organization (soft delete)

## 🚀 How to Use

### Access Profile Page

Navigate to: `/{org}/student/profile`

### Update Profile Programmatically

```typescript
const res = await fetch(`/api/org/${orgSlug}/profile`, {
	method: 'PATCH',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({
		name: 'New Name',
		avatarUrl: 'https://example.com/avatar.jpg',
	}),
})
```

### Fetch Profile Data in Server Component

```typescript
import { getUserProfile } from '@/lib/user-profile'

const profile = await getUserProfile(userEmail, orgSlug)
```

## 🧪 Testing

1. **Start Development Server**

   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   bun dev
   ```

2. **Login to Application**

   - Navigate to `/{org}/login`
   - Login with credentials

3. **Access Profile**

   - Go to `/{org}/student/profile`
   - Verify profile loads correctly

4. **Test Updates**
   - Change name or avatar
   - Click "Save Changes"
   - Verify success message
   - Refresh page to confirm persistence

## 📁 File Structure

```
app/
  api/org/[org]/profile/
    route.ts                    # API endpoints (GET, PATCH, DELETE)
  [org]/student/profile/
    page.tsx                    # Profile page (server component)

components/
  profile-form.tsx              # Form component (client)

lib/
  user-profile.ts               # Helper functions
  auth.ts                       # Auth helpers
  db.ts                         # Prisma client

docs/
  USER_PROFILE_SYSTEM.md        # Full documentation
```

## 🔄 Next Steps

### Optional Enhancements

- [ ] Add profile picture upload to cloud storage
- [ ] Add bio/description field
- [ ] Add phone number and address fields
- [ ] Implement profile privacy settings
- [ ] Add activity timeline
- [ ] Export profile data feature
- [ ] Two-factor authentication
- [ ] Email notification preferences

### Database Migration

If you've made changes to the schema:

```bash
npm run prisma:generate
npm run prisma:migrate
```

## 💡 Key Concepts

**Multi-tenancy**: Profile is scoped to organization using `[org]` slug

**Server Components**: Profile page fetches data server-side for better performance

**Client Components**: Form uses client-side state for interactivity

**Soft Delete**: DELETE endpoint suspends membership instead of deleting user

**Type Safety**: Full TypeScript with Prisma for database operations

## 📞 Support

For detailed documentation, see `/docs/USER_PROFILE_SYSTEM.md`

For issues:

1. Check browser console for errors
2. Verify database connection
3. Ensure user is authenticated
4. Check server logs for API errors
