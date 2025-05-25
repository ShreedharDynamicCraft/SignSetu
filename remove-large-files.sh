#!/bin/bash

echo "Removing large files from Git history..."

# Remove specific large files from Git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch client/node_modules/.cache/default-development/3.pack \
  client/node_modules/.cache/default-development/8.pack \
  client/node_modules/.cache/default-development/12.pack" \
  --prune-empty --tag-name-filter cat -- --all

# Force push to remote (use with caution!)
# git push origin --force --all

echo "Large files have been removed from Git history."
echo "You can now try pushing again with 'git push origin main'"
echo "If you need to force push (USE WITH CAUTION!): git push origin --force --all"
