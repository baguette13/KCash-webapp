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

from api.models import Order, OrderItem, Product
from api.queue.rabbitmq_utils import get_connection

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

def process_order(order_data):
    """
    Process an order received from the queue
    """
    try:
        logger.info(f"Processing order {order_data['order_id']}...")
        
        processing_time = 2  # seconds
        time.sleep(processing_time)
        
        order = Order.objects.get(id=order_data['order_id'])
        logger.info(f"Order {order_data['order_id']} has been successfully processed and remains in 'Pending' status for logistics review.")
        return True
    except Exception as e:
        logger.error(f"Error processing order: {e}")
        return False

def callback(ch, method, properties, body):
    """
    Callback function for processing messages from RabbitMQ
    """
    try:
        order_data = json.loads(body)
        logger.info(f"Received order: {order_data}")
        
        result = process_order(order_data)
        if result:
            ch.basic_ack(delivery_tag=method.delivery_tag)
            logger.info(f"Acknowledged message for order {order_data['order_id']}")
        else:
            ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)
            logger.warning(f"Failed to process order {order_data['order_id']}, requeuing...")
    except Exception as e:
        logger.error(f"Error in callback: {e}")
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)

def start_worker():
    """
    Start a worker to consume and process orders from the queue
    """
    queue_name = 'order_processing'
    
    while True:
        try:
            connection = get_connection()
            if not connection:
                logger.error("Failed to connect to RabbitMQ, retrying in 5 seconds...")
                time.sleep(5)
                continue
                
            channel = connection.channel()
            channel.queue_declare(queue=queue_name, durable=True)
            
            channel.basic_qos(prefetch_count=1)
            
            logger.info(f"Worker started, waiting for messages on queue '{queue_name}'...")
            channel.basic_consume(queue=queue_name, on_message_callback=callback)
            
            channel.start_consuming()
        except pika.exceptions.AMQPConnectionError:
            logger.error("Lost connection to RabbitMQ, reconnecting...")
            time.sleep(5)
        except KeyboardInterrupt:
            logger.info("Worker stopped by user")
            break
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            time.sleep(5)

if __name__ == "__main__":
    logger.info("Starting order processing worker...")
    start_worker()