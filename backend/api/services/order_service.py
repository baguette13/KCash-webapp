from api.repositories.order_repository import OrderRepository
from api.serializers import OrderSerializer

class OrderService:
    @staticmethod
    def get_user_orders(user):
        orders = OrderRepository.get_orders_by_user(user)
        serializer = OrderSerializer(orders, many=True)
        return serializer.data

    @staticmethod
    def create_order(user, data):
        serializer = OrderSerializer(data=data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            validated_data.setdefault('products', [])  # Ustaw domyślną pustą listę
            order = OrderRepository.create_order(user, validated_data)
            return OrderSerializer(order).data
        return {"error": serializer.errors}