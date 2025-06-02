from api.repositories.order_repository import OrderRepository
from api.serializers import OrderSerializer
from api.queue.rabbitmq_utils import send_message
import logging

logger = logging.getLogger(__name__)

class LogisticsService:
    @staticmethod
    def get_all_orders():
        """
        Get all orders for logistics staff
        """
        orders = OrderRepository.get_all_orders()
        serializer = OrderSerializer(orders, many=True)
        return serializer.data
    
    @staticmethod
    def get_pending_orders():
        """
        Get pending orders for logistics staff
        """
        orders = OrderRepository.get_orders_by_status('Pending')
        serializer = OrderSerializer(orders, many=True)
        return serializer.data
    
    @staticmethod
    def get_completed_orders():
        """
        Get completed orders for logistics staff
        """
        orders = OrderRepository.get_orders_by_status('Completed')
        serializer = OrderSerializer(orders, many=True)
        return serializer.data
    
    @staticmethod
    def update_order_status(order_id, status):
        """
        Update order status
        """
        valid_statuses = ['Pending', 'Completed']
        if status not in valid_statuses:
            return {"error": f"Invalid status: {status}. Must be one of {valid_statuses}"}
            
        try:
            order = OrderRepository.get_order_with_products(order_id)
            if not order:
                return {"error": f"Order with ID {order_id} not found"}
                
            order = OrderRepository.update_order_status(order_id, status)
            
            if status == 'Completed':
                message = {
                    'order_id': order_id,
                    'action': 'update_status',
                    'status': status,
                    'timestamp': str(order.created_at)
                }
                queue_result = send_message('order_status_updates', message)
                
                if not queue_result:
                    logger.warning(f"Could not send order {order_id} status update to queue for post-processing")
                else:
                    logger.info(f"Order {order_id} status update sent to queue for post-processing")
            else:
                order = OrderRepository.update_order_status(order_id, status)
            
            serializer = OrderSerializer(order)
            logger.info(f"Order {order_id} status updated to {status}")
            return serializer.data
        except Exception as e:
            logger.error(f"Error updating order status: {e}")
            return {"error": str(e)}
