#!/bin/sh
set -e

echo "🚀 Starting AI-LMS Application..."

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL..."
until nc -z postgres 5432; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "✅ PostgreSQL is ready"

# Note: Run migrations manually using:
# docker-compose exec app sh -c "cd /app && npx prisma migrate deploy"
# This is because the standalone Next.js build doesn't include all Prisma dependencies

echo "🎉 Starting Next.js server..."

# Execute the main container command
exec "$@"
