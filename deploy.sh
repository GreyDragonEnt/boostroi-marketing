#!/bin/bash

echo "Building production assets..."
npm run build

echo "Starting production server with tsx..."
NODE_ENV=production tsx server/index.ts