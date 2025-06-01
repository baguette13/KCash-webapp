#!/bin/bash

echo "Starting order processing workers..."

run_worker() {
    echo "Starting $1 worker..."
    python /app/$1 &
    PID=$!
    echo "$PID" > "/tmp/$2.pid"
    echo "$1 worker started with PID: $PID"
}

run_worker "api/queue/order_worker.py" "order_worker"
run_worker "api/queue/status_worker.py" "status_worker"

echo "All workers started. Waiting for processes..."
wait