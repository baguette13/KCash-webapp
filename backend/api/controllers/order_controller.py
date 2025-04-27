from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from api.services.order_service import OrderService

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def order_list(request):
    if request.method == 'GET':
        orders = OrderService.get_user_orders(request.user)
        return Response(orders, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        result = OrderService.create_order(request.user, request.data)
        if result.get("error"):
            return Response(result, status=status.HTTP_400_BAD_REQUEST)
        return Response(result, status=status.HTTP_201_CREATED)
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_orders(request):
    """
    Endpoint do pobierania historii zamówień użytkownika.
    """
    user_orders = OrderService.get_user_orders(request.user)
    return Response(user_orders, status=status.HTTP_200_OK)