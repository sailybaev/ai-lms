# Organization Branding Feature

This feature allows organization administrators to customize their platform's branding by setting a custom platform name and logo.

## Overview

Organization admins can now:

- Set a custom platform name that appears in the sidebar
- Upload/set a logo URL that replaces the default graduation cap icon
- Preview changes before saving
- Changes are reflected immediately across the organization

## Implementation Details

### Database Schema

Added `platformName` field to the `Organization` model:

```prisma
model Organization {
  id           String    @id @default(uuid())
  slug         String    @unique
  name         String
  platformName String?   @map("platform_name")
  logoUrl      String?   @map("logo_url")
  ...
}
```

### API Endpoints

#### GET `/api/org/[orgSlug]/branding`

Fetches the organization's branding information.

**Response:**

```json
{
	"id": "uuid",
	"name": "Organization Name",
	"platformName": "Custom Platform Name",
	"logoUrl": "https://example.com/logo.png"
}
```

#### PATCH `/api/org/[orgSlug]/branding`

Updates the organization's branding information.

**Request Body:**

```json
{
	"platformName": "Custom Platform Name",
	"logoUrl": "https://example.com/logo.png"
}
```

### Components Modified

#### 1. Organization Context (`lib/org-context.tsx`)

- Extended to fetch and store organization branding data
- Added `refetchOrganization` method for refreshing data after updates
- Provides organization data to all child components

#### 2. App Sidebar (`components/app-sidebar.tsx`)

- Now displays organization's custom logo (if set)
- Shows custom platform name (defaults to "EduAI" if not set)
- Falls back to graduation cap icon if no logo is provided

#### 3. Settings Page (`app/[org]/admin/settings/page.tsx`)

- New settings page for organization admins
- Includes branding section with:
  - Platform Name input field
  - Logo URL input field
  - Live logo preview
  - Save/Cancel buttons
- Form validation and error handling
- Loading states while fetching/saving

## Usage

### For Organization Admins

1. Navigate to Settings page from the sidebar
2. Locate the "Branding" section
3. Enter your desired platform name (e.g., "Harvard Online Learning")
4. Enter the URL to your organization's logo
5. Preview the logo to ensure it looks correct
6. Click "Save Changes" to apply the branding

### Recommendations

**Logo Guidelines:**

- Use a square or rectangular logo
- Recommended size: 200x200px or larger
- Supported formats: PNG, JPG, SVG
- Logo should work well on dark backgrounds
- Use transparent backgrounds for best results

**Platform Name Guidelines:**

- Keep it concise (2-4 words)
- Should represent your organization
- Examples: "Acme Learning", "University Portal", "EduHub"

## Testing

To test the feature:

1. Start the development server
2. Login as an org admin
3. Navigate to `/{orgSlug}/admin/settings`
4. Update the platform name and logo URL
5. Save changes
6. Verify the sidebar updates with new branding

## Future Enhancements

Potential improvements for this feature:

- File upload for logos (instead of URL only)
- Additional branding options (colors, themes)
- Favicon customization
- Email template branding
- Multi-language platform names
