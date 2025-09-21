#!/bin/bash

echo "Starting Disaster Management App Development Environment..."
echo

echo "Starting Backend Server..."
cd Backend && npm run dev:simple &
BACKEND_PID=$!

sleep 3

echo "Starting Frontend Server..."
cd ../Frontend && npm run dev &
FRONTEND_PID=$!

echo
echo "Both servers are starting..."
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:8081"
echo
echo "Press Ctrl+C to stop all servers"

# Function to cleanup on exit
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT

# Wait for user to stop
wait
