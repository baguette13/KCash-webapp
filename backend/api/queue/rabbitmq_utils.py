import os
import pika
import json
import logging

logger = logging.getLogger(__name__)

def get_connection():
    """
    Create and return a connection to RabbitMQ server.
    """
    rabbitmq_host = os.getenv('RABBITMQ_HOST', 'localhost')
    try:
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(host=rabbitmq_host)
        )
        return connection
    except Exception as e:
        logger.error(f"Error connecting to RabbitMQ: {e}")
        return None

def send_message(queue_name, message):
    """
    Send a message to a specific queue.
    """
    connection = get_connection()
    if not connection:
        logger.error("Failed to send message: no connection")
        return False
    
    try:
        channel = connection.channel()
        channel.queue_declare(queue=queue_name, durable=True)
        
        channel.basic_publish(
            exchange='',
            routing_key=queue_name,
            body=json.dumps(message),
            properties=pika.BasicProperties(
                delivery_mode=2,  
            )
        )
        logger.info(f"Sent message to {queue_name}")
        connection.close()
        return True
    except Exception as e:
        logger.error(f"Error sending message: {e}")
        if connection and connection.is_open:
            connection.close()
        return False