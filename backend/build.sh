#!/usr/bin/env bash
set -e

echo "==> Installing dependencies with npm"
npm install

echo "==> Compiling TypeScript"
./node_modules/.bin/tsc

echo "==> Verifying dist/index.js exists"
if [ ! -f "dist/index.js" ]; then
  echo "ERROR: dist/index.js not found after build"
  exit 1
fi

echo "==> Build complete"
