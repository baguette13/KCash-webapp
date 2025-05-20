from api.models import Order, OrderItem, Product

class OrderRepository:
    @staticmethod
    def get_orders_by_user(user):
        return Order.objects.filter(user=user).prefetch_related('orderitem_set__product').order_by('-created_at')

    @staticmethod
    def get_order_with_products(order_id):
        """
        Pobierz zamówienie wraz z powiązanymi produktami
        """
        return Order.objects.prefetch_related('orderitem_set__product').get(id=order_id)

    @staticmethod
    def create_order(user, validated_data):
        products_data = validated_data.pop('products', [])
        validated_data.pop('user', None)
        # Tworzenie zamówienia bez produktów
        order = Order.objects.create(user=user, **validated_data)
        
        # Tworzenie pozycji zamówienia w modelu pośrednim OrderItem
        for product_data in products_data:
            product_id = product_data.get('product', {}).get('id')
            quantity = product_data.get('quantity', 1)
            try:
                product = Product.objects.get(id=product_id)
                OrderItem.objects.create(order=order, product=product, quantity=quantity)
            except Product.DoesNotExist:
                print(f"Product with id {product_id} does not exist")
        
        return order