#!/bin/bash

# Start the order processing worker
echo "Starting order processing worker..."
python /app/api/queue/order_worker.py