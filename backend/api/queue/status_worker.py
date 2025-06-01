import os
import sys
import django
import time
import json
import pika
import logging
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(BASE_DIR)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Order
from api.queue.rabbitmq_utils import get_connection

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

def process_status_update(data):
    """
    Process an order status update received from the queue
    """
    try:
        order_id = data.get('order_id')
        status = data.get('status')
        
        logger.info(f"Processing status update for order {order_id} to {status}...")
        
        time.sleep(1)
        
        order = Order.objects.get(id=order_id)
        order.status = status
        order.save()
        
        logger.info(f"Order {order_id} status has been updated to {status}")
        return True
    except Order.DoesNotExist:
        logger.error(f"Order with ID {order_id} not found")
        return False
    except Exception as e:
        logger.error(f"Error processing order status update: {e}")
        return False

def callback(ch, method, properties, body):
    """
    Callback function for processing messages from RabbitMQ
    """
    try:
        data = json.loads(body)
        logger.info(f"Received message: {data}")
        
        if 'action' in data and data['action'] == 'update_status':
            success = process_status_update(data)
            if success:
                ch.basic_ack(delivery_tag=method.delivery_tag)
            else:
                ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)
        else:
            logger.warning(f"Unknown message format: {data}")
            ch.basic_ack(delivery_tag=method.delivery_tag)
    except json.JSONDecodeError:
        logger.error(f"Invalid JSON format in message: {body}")
        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as e:
        logger.error(f"Error processing message: {e}")
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)

def start_worker():
    """
    Start the worker to consume messages from the queue
    """
    connection = get_connection()
    if not connection:
        logger.error("Could not connect to RabbitMQ")
        return
    
    try:
        channel = connection.channel()
        channel.queue_declare(queue='order_status_updates', durable=True)
        
        channel.basic_qos(prefetch_count=1)
        
        channel.basic_consume(
            queue='order_status_updates',
            on_message_callback=callback,
            auto_ack=False
        )
        
        logger.info('Status update worker started. Waiting for messages...')
        channel.start_consuming()
    except KeyboardInterrupt:
        logger.info("Worker stopped by user")
        if connection and connection.is_open:
            connection.close()
    except Exception as e:
        logger.error(f"Worker error: {e}")
        if connection and connection.is_open:
            connection.close()

if __name__ == "__main__":
    start_worker()
