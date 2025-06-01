from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from api.services.logistics_service import LogisticsService
from api.services.user_service import UserService

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_orders(request):
    """
    Endpoint to get all orders for logistics staff
    """
    if not request.user.is_staff:
        return Response({"error": "You are not authorized to access this resource"}, 
                      status=status.HTTP_403_FORBIDDEN)
    
    orders = LogisticsService.get_all_orders()
    return Response({"data": orders}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_pending_orders(request):
    """
    Endpoint to get pending orders for logistics staff
    """
    if not request.user.is_staff:
        return Response({"error": "You are not authorized to access this resource"}, 
                      status=status.HTTP_403_FORBIDDEN)
    
    orders = LogisticsService.get_pending_orders()
    return Response({"data": orders}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_completed_orders(request):
    """
    Endpoint to get completed orders for logistics staff
    """
    if not request.user.is_staff:
        return Response({"error": "You are not authorized to access this resource"}, 
                      status=status.HTTP_403_FORBIDDEN)
    
    orders = LogisticsService.get_completed_orders()
    return Response({"data": orders}, status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_order_status(request, order_id):
    """
    Endpoint to update order status
    """
    if not request.user.is_staff:
        return Response({"error": "You are not authorized to access this resource"}, 
                      status=status.HTTP_403_FORBIDDEN)
    
    status_value = request.data.get('status')
    if not status_value:
        return Response({"error": "Status is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    result = LogisticsService.update_order_status(order_id, status_value)
    
    if "error" in result:
        return Response(result, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({"data": result}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_staff_status(request):
    """
    Endpoint to check if the user is a staff member
    """
    is_staff = UserService.is_staff_user(request.user)
    return Response({"is_staff": is_staff}, status=status.HTTP_200_OK)
