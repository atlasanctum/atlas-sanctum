#!/bin/bash
# Untrack .env files from all nested dashboard/layer repos and enforce .gitignore

ROOT=$(pwd)

while IFS= read -r dir; do
  if [ -d "$ROOT/$dir/.git" ]; then
    tracked=$(git -C "$ROOT/$dir" ls-files | grep "^\.env$")
    if [ -n "$tracked" ]; then
      git -C "$ROOT/$dir" rm --cached .env
      echo "Untracked: $dir/.env"
    fi
    gitignore="$ROOT/$dir/.gitignore"
    if ! grep -qx ".env" "$gitignore" 2>/dev/null; then
      printf "\n.env\n.env.*\n!.env.example\n" >> "$gitignore"
      echo "Updated .gitignore: $dir"
    fi
  fi
done < /tmp/dashboard_dirs.txt

echo "Done."
