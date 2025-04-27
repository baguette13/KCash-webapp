from api.models import Order, OrderItem, Product

class OrderRepository:
    @staticmethod
    def get_orders_by_user(user):
        return Order.objects.filter(user=user).order_by('-created_at')

    @staticmethod
    def create_order(user, validated_data):
        products_data = validated_data.pop('products', [])
        validated_data.pop('user', None)
        # Tworzenie zamówienia bez produktów
        order = Order.objects.create(user=user, **validated_data)
        
        # Tworzenie pozycji zamówienia w modelu pośrednim OrderItem
        for product_data in products_data:
            product = Product.objects.get(id=product_data['product']['id'])
            OrderItem.objects.create(order=order, product=product, quantity=product_data['quantity'])
        
        return order