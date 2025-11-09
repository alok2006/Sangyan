#!/usr/bin/env bash
set -euo pipefail

# build.sh — build frontend and collect Django static files
# Usage:
#   ./build.sh            # build frontend and run collectstatic
#   ./build.sh --no-collectstatic
#   ./build.sh --help

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "Repository root: $ROOT"

NO_COLLECTSTATIC=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --no-collectstatic) NO_COLLECTSTATIC=1; shift ;;
    --help|-h)
      cat <<'USAGE'
Usage: build.sh [--no-collectstatic]

Options:
  --no-collectstatic   Build frontend but skip Django's collectstatic step.
  -h, --help           Show this help and exit.
USAGE
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

# --- Build frontend (if present) ---
if [ -d "$ROOT/frontend" ]; then
  echo "Building frontend..."
  cd "$ROOT/frontend"

  if ! command -v npm >/dev/null 2>&1; then
    echo "npm not found — install Node.js/npm to build the frontend." >&2
    exit 1
  fi

  if [ -f package-lock.json ]; then
    echo "Running: npm ci"
    npm ci
  else
    echo "Running: npm install"
    npm install
  fi

  echo "Running: npm run build"
  npm run build
else
  echo "No frontend directory found at $ROOT/frontend — skipping frontend build."
fi

# --- Collect static into Django STATIC_ROOT ---
if [ "$NO_COLLECTSTATIC" -eq 0 ]; then
  echo "Collecting Django static files..."
  cd "$ROOT/backend"

  PYTHON_EXEC=""
  # Prefer project-level virtualenv: ./bin/python, ./venv/bin/python
  if [ -x "$ROOT/bin/python" ]; then
    PYTHON_EXEC="$ROOT/bin/python"
  elif [ -x "$ROOT/venv/bin/python" ]; then
    PYTHON_EXEC="$ROOT/venv/bin/python"
  elif command -v python3 >/dev/null 2>&1; then
    PYTHON_EXEC=python3
  else
    echo "No suitable Python interpreter found (checked ./bin/python, ./venv/bin/python, and system python3)." >&2
    exit 1
  fi

  echo "Using Python: $PYTHON_EXEC"
  "$PYTHON_EXEC" manage.py collectstatic --noinput
else
  echo "Skipping collectstatic (flag --no-collectstatic provided)."
fi

echo "Build script finished successfully."
exit 0
