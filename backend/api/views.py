from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .models import Product, Order, ClientUser
from .serializers import ProductSerializer, OrderSerializer, UserSerializer
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

@api_view(['GET', 'POST'])
def product_list(request):
    if request.method == 'GET':
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def order_list(request):
    if request.method == 'GET':
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)  # Przypisz zamówienie do aktualnie zalogowanego użytkownika
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
    user=request.user
    user_orders = Order.objects.filter(user=user).order_by('-created_at')
    serializer = OrderSerializer(user_orders, many=True)
    return Response(serializer.data)