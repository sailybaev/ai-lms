# Uploads Directory

This directory contains user-uploaded files.

## Structure

```
uploads/
  avatars/     # User profile photos
    .gitkeep   # Keeps directory in version control
```

## Avatar Files

- **Format**: `{userId}_{timestamp}.{extension}`
- **Max Size**: 5MB per file
- **Types**: All image formats (JPEG, PNG, GIF, WebP, etc.)

## Important Notes

⚠️ **Security**: This directory should have appropriate write permissions for the application but should not allow arbitrary script execution.

⚠️ **Gitignore**: Actual uploaded files should be in `.gitignore` to avoid committing user data to version control.

⚠️ **Backups**: Implement regular backups of this directory in production.

⚠️ **Production**: For production deployments, consider using cloud storage (S3, Cloudinary, Vercel Blob) instead of filesystem storage.

## Production Considerations

### Cloud Storage Migration

For production environments, we recommend migrating to cloud storage:

1. **AWS S3** - Most common, scalable solution
2. **Cloudinary** - Great for image processing
3. **Vercel Blob Storage** - Best for Vercel deployments
4. **Google Cloud Storage** - Good alternative to S3

### Why Cloud Storage?

- ✅ Scalability
- ✅ CDN integration
- ✅ Automatic backups
- ✅ Better performance
- ✅ No server disk space concerns
- ✅ Geographic distribution

## Maintenance

Regular maintenance tasks:

- Monitor disk usage
- Clean up orphaned files (files not referenced in database)
- Implement file retention policies
- Rotate logs of upload activity
