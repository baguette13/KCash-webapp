from rest_framework import serializers
from .models import ClientUser, Product, Order, OrderItem

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientUser
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'is_staff',)

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    
    class Meta:
        model = OrderItem
        fields = ('product', 'quantity')

class OrderItemCreateSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(source='product.id')
    
    class Meta:
        model = OrderItem
        fields = ('product_id', 'quantity')

class OrderSerializer(serializers.ModelSerializer):
    products = OrderItemSerializer(source='orderitem_set', many=True, read_only=True)
    user_details = UserSerializer(source='user', read_only=True)
    
    class Meta:
        model = Order
        fields = ('id', 'user', 'user_details', 'products', 'total_price', 'status', 'created_at')
        
    def to_representation(self, instance):
        if isinstance(instance, Order):
            try:
                instance = Order.objects.prefetch_related('orderitem_set__product').get(pk=instance.pk)
            except Order.DoesNotExist:
                pass
        return super().to_representation(instance)
        
    def create(self, validated_data):
        products_data = self.initial_data.get('products', [])
        order = Order.objects.create(**validated_data)
        
        for product_data in products_data:
            product_id = product_data.get('product', {}).get('id')
            quantity = product_data.get('quantity', 1)
            
            if product_id:
                try:
                    product = Product.objects.get(id=product_id)
                    OrderItem.objects.create(order=order, product=product, quantity=quantity)
                except Product.DoesNotExist:
                    pass
        
        return order
