#!/bin/sh

cd dist

npm install --production

# Make a copy that changes symlinks to hard copies
rsync --quiet --archive --verbose --copy-links ./node_modules/ ./node_modules_cp/

# Remove and replace
echo "unpacking symlinks"
rm -r ./node_modules/
mv ./node_modules_cp/ ./node_modules/

# Create archive
zip -r -q ../deploy.zip *

echo "archive created"