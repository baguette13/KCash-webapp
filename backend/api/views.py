from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .models import Product, Order, ClientUser
from .serializers import ProductSerializer, OrderSerializer, UserSerializer
from django.contrib.auth import get_user_model
from django.http import JsonResponse



from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        order = serializer.save(user=self.request.user)
        order.total_price = sum(item.product.price * item.quantity for item in order.orderitem_set.all())
        order.save()

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile_details(request):
    user = request.user  # Zaciąganie zalogowanego użytkownika
    serializer = UserSerializer(user)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user  # Zaciąganie zalogowanego użytkownika

    # Odczyt danych z żądania
    data = request.data
    user.first_name = data.get('first_name', user.first_name)
    user.last_name = data.get('last_name', user.last_name)
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)

    # Zapisanie zaktualizowanych danych
    user.save()

    return JsonResponse({'message': 'Profile updated successfully'})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_orders(request):
    user_orders = Order.objects.filter(user=request.user).order_by('-created_at')
    serializer = OrderSerializer(user_orders, many=True)
    return Response(serializer.data)