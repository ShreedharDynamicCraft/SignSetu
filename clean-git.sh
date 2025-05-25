#!/bin/bash

echo "Cleaning Git repository from large files..."

# Remove node_modules cache directories physically
rm -rf client/node_modules/.cache/
rm -rf server/node_modules/.cache/

# Create a .gitignore if it doesn't exist
if [ ! -f .gitignore ]; then
    echo "Creating .gitignore file..."
    touch .gitignore
fi

# Ensure these patterns are in .gitignore
echo "Updating .gitignore..."
echo "# Dependencies" > .gitignore
echo "/node_modules" >> .gitignore
echo "/client/node_modules" >> .gitignore
echo "/server/node_modules" >> .gitignore
echo "/.pnp" >> .gitignore
echo ".pnp.js" >> .gitignore
echo "" >> .gitignore
echo "# Cache files - more aggressive patterns" >> .gitignore
echo "**/.cache/**" >> .gitignore
echo "**/*.pack" >> .gitignore
echo "**/*.pack.old" >> .gitignore
echo "**/cache/**" >> .gitignore
echo "client/node_modules/" >> .gitignore
echo "server/node_modules/" >> .gitignore

# Remove cached files from Git
echo "Removing cached files from Git..."
git rm -r --cached .
git add .
git commit -m "Fix: Remove large files from Git history"

echo "Done! Now try pushing again with 'git push origin main'"
echo "If issues persist, you might need Git LFS or a fresh repository."
