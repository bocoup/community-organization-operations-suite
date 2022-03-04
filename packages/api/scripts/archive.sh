#!/bin/sh
set -e
cd dist

echo "archiving api"
echo "installing production dependencies..."
npm install --production

# Make a copy that changes symlinks to hard copies
echo "copying installed node modules..."
rsync --quiet --archive --verbose --copy-links ./node_modules/ ./node_modules_cp/

# Remove and replace
echo "unpacking symlinks..."
rm -r ./node_modules/
mv ./node_modules_cp/ ./node_modules/

# Create archive
echo "creating archive..."
zip -r -q ../deploy.zip *

echo "archive created"