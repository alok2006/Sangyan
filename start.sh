#!/usr/bin/env bash
set -euo pipefail

# start.sh — run DB migrations, (optionally) collectstatic, then start Gunicorn
# Intended as the Render.com startCommand for the web service.

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT/backend"

PYTHON=${PYTHON:-python3}

echo "Running migrations..."
$PYTHON manage.py migrate --noinput || true

echo "Ensuring static files are collected..."
$PYTHON manage.py collectstatic --noinput || true

# Start Gunicorn using Uvicorn worker for ASGI support
WEB_CONCURRENCY=${WEB_CONCURRENCY:-4}
PORT=${PORT:-8000}

echo "Starting Gunicorn on port $PORT with $WEB_CONCURRENCY workers..."
exec gunicorn backend.wsgi:application -w "$WEB_CONCURRENCY" -k uvicorn.workers.UvicornWorker -b 0.0.0.0:$PORT
