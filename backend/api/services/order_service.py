from api.repositories.order_repository import OrderRepository
from api.serializers import OrderSerializer
from api.queue.rabbitmq_utils import send_message
import logging

logger = logging.getLogger(__name__)

class OrderService:
    @staticmethod
    def get_user_orders(user, status_filter=None):
        """
        Get user orders with optional status filtering
        """
        if status_filter:
            orders = OrderRepository.get_orders_by_user_and_status(user, status_filter)
        else:
            orders = OrderRepository.get_orders_by_user(user)
        
        serializer = OrderSerializer(orders, many=True)
        return serializer.data

    @staticmethod
    def create_order(user, data):
        data['user'] = user.id
        serializer = OrderSerializer(data=data)
        
        if serializer.is_valid():
            order = serializer.save()
            
            order_data = {
                'order_id': order.id,
                'user_id': user.id,
                'timestamp': order.created_at.isoformat()
            }
            
            queue_result = send_message('order_processing', order_data)
            if queue_result:
                logger.info(f"Order {order.id} sent to processing queue")
            else:
                logger.error(f"Failed to send order {order.id} to processing queue")
            
            order_with_products = OrderRepository.get_order_with_products(order.id)
            return OrderSerializer(order_with_products).data
        return {"error": serializer.errors}