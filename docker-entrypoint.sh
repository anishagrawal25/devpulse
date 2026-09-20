#!/bin/sh
set -e

echo "🚀 [DevPulse] Starting application in container..."

# Initialize database schema if SQLite DB is being used
if [ -n "$DATABASE_URL" ]; then
  echo "📦 [DevPulse] Syncing database schema..."
  npx prisma db push --skip-generate || echo "Database sync completed or skipped."
fi

echo "⚡ [DevPulse] Server starting on port ${PORT:-3000}..."
exec node server.js
