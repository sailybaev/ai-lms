# Quick Testing Guide: Password & Photo Features

## 🚀 Quick Start

### Access the Profile Page

Navigate to: `http://localhost:3000/acme/student/profile`
(Replace `acme` with your organization slug and `student` with your role)

---

## 📸 Test Photo Upload

### Method 1: Direct Upload (Recommended)

1. Go to the **Profile** tab
2. Click the **camera icon** (📷) on your profile picture
3. Select an image file from your computer
4. Wait for the upload to complete
5. ✅ Your new photo should appear immediately

### Method 2: URL Input

1. Go to the **Profile** tab
2. Scroll to the "Avatar URL" field
3. Enter a direct image URL (e.g., `https://i.pravatar.cc/300`)
4. Click **"Save Changes"**
5. ✅ Photo should update

### Validation Tests

Try these to test error handling:

- ❌ Upload a file > 5MB (should fail with error)
- ❌ Upload a non-image file like PDF (should fail)
- ✅ Upload PNG, JPG, GIF, WebP (should work)

### Where Files Are Stored

- Local path: `/public/uploads/avatars/`
- URL format: `/uploads/avatars/{userId}_{timestamp}.{ext}`
- Check: `http://localhost:3000/uploads/avatars/` in browser

---

## 🔐 Test Password Change

### Steps

1. Go to the **Security** tab
2. Fill in the form:
   - **Current Password**: Your current password
   - **New Password**: At least 8 characters
   - **Confirm Password**: Must match new password
3. Click **"Change Password"**
4. ✅ You should see a success toast

### Test After Change

1. Log out of the application
2. Log back in with your **new password**
3. ✅ Should successfully authenticate

### Validation Tests

Try these to test error handling:

- ❌ Wrong current password (should fail)
- ❌ New password < 8 characters (should fail)
- ❌ Passwords don't match (should fail)
- ✅ All correct (should succeed)

---

## 🎯 Expected Behavior

### Photo Upload

| Action                | Result                                      |
| --------------------- | ------------------------------------------- |
| Click camera icon     | Opens file picker                           |
| Select valid image    | Uploads and shows new photo                 |
| Upload too large file | Error: "Image size must be less than 5MB"   |
| Upload non-image      | Error: "Please select an image file"        |
| Success               | Toast: "Photo uploaded" + immediate display |

### Password Change

| Action                 | Result                                               |
| ---------------------- | ---------------------------------------------------- |
| Submit valid form      | Success toast + password updated                     |
| Wrong current password | Error: "Current password is incorrect"               |
| Password too short     | Error: "Password must be at least 8 characters long" |
| Passwords don't match  | Error: "New passwords do not match"                  |
| Success                | Form clears + toast notification                     |

---

## 🔍 Debugging

### Photo Upload Not Working?

**Check browser console for errors:**

```bash
# Open browser DevTools (F12)
# Look for network errors or 500 responses
```

**Verify upload directory exists:**

```bash
ls -la public/uploads/avatars/
```

**Check file permissions:**

```bash
# Ensure the app can write to the uploads directory
chmod 755 public/uploads/avatars/
```

### Password Change Not Working?

**Check if user has password set:**

- Some users might be created without passwords (OAuth)
- Check database: `SELECT email, passwordHash FROM User WHERE email = 'your@email.com'`

**Verify current password:**

- Make sure you're entering the correct current password
- Try resetting it if forgotten

**Check API logs:**

```bash
# Check terminal where Next.js is running for error messages
```

---

## 📊 Database Verification

### Check Photo URL in Database

```sql
SELECT id, name, email, avatarUrl
FROM User
WHERE email = 'your@email.com';
```

### Check Password Hash

```sql
SELECT id, email, passwordHash
FROM User
WHERE email = 'your@email.com';
```

Note: The hash should change after password update

---

## 🎨 UI Elements

### Profile Tab Features

- ✅ Avatar with initials or photo
- ✅ Camera button overlay
- ✅ Name input field
- ✅ Email (read-only)
- ✅ Avatar URL (optional)
- ✅ Save/Cancel buttons

### Security Tab Features

- ✅ Current Password field
- ✅ New Password field (min 8 chars)
- ✅ Confirm Password field
- ✅ Helper text for requirements
- ✅ Change Password button

---

## 🚨 Common Issues & Solutions

### Issue: "Failed to upload photo"

**Solution:**

1. Check if `public/uploads/avatars/` directory exists
2. Verify write permissions
3. Check disk space
4. Look for errors in terminal

### Issue: "Current password is incorrect"

**Solution:**

1. Double-check your current password
2. Try resetting password through auth system
3. Verify user has passwordHash in database

### Issue: Photo doesn't appear after upload

**Solution:**

1. Hard refresh the page (Ctrl+F5)
2. Check if file was created in `public/uploads/avatars/`
3. Verify avatarUrl in database was updated
4. Check browser console for 404 errors

### Issue: Can't change password

**Solution:**

1. Verify all fields are filled
2. Check password length (min 8 characters)
3. Ensure passwords match
4. Check if user account was created with OAuth (might not have password)

---

## ✅ Success Checklist

### Photo Upload

- [ ] Camera icon appears on avatar
- [ ] File picker opens when clicked
- [ ] Upload shows loading state
- [ ] Success toast appears
- [ ] Photo updates immediately
- [ ] Photo persists after refresh
- [ ] File saved in `/public/uploads/avatars/`
- [ ] Database avatarUrl field updated

### Password Change

- [ ] Security tab is accessible
- [ ] All three password fields present
- [ ] Validation works (min 8 chars)
- [ ] Mismatch error shows
- [ ] Wrong password error shows
- [ ] Success toast appears on valid change
- [ ] Form clears after success
- [ ] Can log in with new password
- [ ] Database passwordHash updated

---

## 🔗 Related Files

- **Component**: `/components/profile-form.tsx`
- **Password API**: `/app/api/org/[org]/profile/password/route.ts`
- **Photo API**: `/app/api/org/[org]/profile/photo/route.ts`
- **Uploads Dir**: `/public/uploads/avatars/`
- **Docs**: `/docs/PROFILE_PASSWORD_PHOTO_FEATURE.md`

---

## 📝 Notes

- Photo uploads are stored locally (consider cloud storage for production)
- Passwords are hashed with bcrypt (10 salt rounds)
- Maximum photo size: 5MB
- Minimum password length: 8 characters
- Photos are accessible at `/uploads/avatars/{filename}`
- Password changes take effect immediately (no logout required)

---

## 🎯 Next Steps

After testing locally, consider:

1. Setting up cloud storage (S3, Cloudinary) for photos
2. Adding password strength indicator
3. Implementing password history
4. Adding 2FA for enhanced security
5. Email notification on password change
6. Image optimization/resizing on upload
7. CDN for serving uploaded images
