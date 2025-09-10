#!/bin/sh

# Start the API
echo "Starting API server..."
PORT=${PORT:-4360} ./server
