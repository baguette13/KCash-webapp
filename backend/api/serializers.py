from rest_framework import serializers
from .models import ClientUser, Product, Order, OrderItem

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientUser
        fields = ('id', 'first_name', 'last_name', 'email',)

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    class Meta:
        model = OrderItem
        fields = ('product', 'quantity')

class OrderSerializer(serializers.ModelSerializer):
    products = OrderItemSerializer(source='orderitem_set', many=True, read_only=True)
    class Meta:
        model = Order
        fields = ('id', 'user', 'products', 'total_price', 'status', 'created_at')
