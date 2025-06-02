from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from api.services.logistics_service import LogisticsService
from api.services.user_service import UserService
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

@swagger_auto_schema(
    tags=['Logistics'],
    method='get',
    operation_description="Get all orders for logistics staff",
    manual_parameters=[
        openapi.Parameter('Authorization', openapi.IN_HEADER, description="Bearer {token}", type=openapi.TYPE_STRING, required=True),
    ],
    responses={
        200: openapi.Response(
            description="All orders retrieved successfully",
            examples={
                'application/json': {
                    'data': [{
                        'id': 1,
                        'user': 'customer1',
                        'date_created': '2025-06-01T09:00:00Z',
                        'status': 'pending',
                        'total_price': 49.98,
                        'delivery_address': '123 Customer Street'
                    }]
                }
            }
        ),
        401: openapi.Response(description="Unauthorized - Authentication credentials were not provided"),
        403: openapi.Response(
            description="Forbidden - User does not have staff permissions",
            examples={
                'application/json': {
                    'error': 'You are not authorized to access this resource'
                }
            }
        ),
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_orders(request):
    """
    Get all orders for logistics staff members only
    """
    if not request.user.is_staff:
        return Response({"error": "You are not authorized to access this resource"}, 
                      status=status.HTTP_403_FORBIDDEN)
    
    orders = LogisticsService.get_all_orders()
    return Response({"data": orders}, status=status.HTTP_200_OK)

@swagger_auto_schema(
    tags=['Logistics'],
    method='get',
    operation_description="Get all pending orders for logistics staff",
    manual_parameters=[
        openapi.Parameter('Authorization', openapi.IN_HEADER, description="Bearer {token}", type=openapi.TYPE_STRING, required=True),
    ],
    responses={
        200: openapi.Response(
            description="Pending orders retrieved successfully",
            examples={
                'application/json': {
                    'data': [{
                        'id': 1,
                        'user': 'customer1',
                        'date_created': '2025-06-01T09:00:00Z',
                        'status': 'pending',
                        'total_price': 49.98,
                        'delivery_address': '123 Customer Street'
                    }]
                }
            }
        ),
        401: openapi.Response(description="Unauthorized - Authentication credentials were not provided"),
        403: openapi.Response(description="Forbidden - User does not have staff permissions"),
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_pending_orders(request):
    """
    Get pending orders for logistics staff members only
    """
    if not request.user.is_staff:
        return Response({"error": "You are not authorized to access this resource"}, 
                      status=status.HTTP_403_FORBIDDEN)
    
    orders = LogisticsService.get_pending_orders()
    return Response({"data": orders}, status=status.HTTP_200_OK)

@swagger_auto_schema(
    tags=['Logistics'],
    method='get',
    operation_description="Get all completed orders for logistics staff",
    manual_parameters=[
        openapi.Parameter('Authorization', openapi.IN_HEADER, description="Bearer {token}", type=openapi.TYPE_STRING, required=True),
    ],
    responses={
        200: openapi.Response(
            description="Completed orders retrieved successfully",
            examples={
                'application/json': {
                    'data': [{
                        'id': 2,
                        'user': 'customer2',
                        'date_created': '2025-05-28T14:30:00Z',
                        'status': 'delivered',
                        'total_price': 129.95,
                        'delivery_address': '456 Another Street'
                    }]
                }
            }
        ),
        401: openapi.Response(description="Unauthorized - Authentication credentials were not provided"),
        403: openapi.Response(description="Forbidden - User does not have staff permissions"),
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_completed_orders(request):
    """
    Get completed orders for logistics staff members only
    """
    if not request.user.is_staff:
        return Response({"error": "You are not authorized to access this resource"}, 
                      status=status.HTTP_403_FORBIDDEN)
    
    orders = LogisticsService.get_completed_orders()
    return Response({"data": orders}, status=status.HTTP_200_OK)

@swagger_auto_schema(
    tags=['Logistics'],
    method='put',
    operation_description="Update status of a specific order",
    manual_parameters=[
        openapi.Parameter('Authorization', openapi.IN_HEADER, description="Bearer {token}", type=openapi.TYPE_STRING, required=True),
        openapi.Parameter('order_id', openapi.IN_PATH, description="ID of the order to update", type=openapi.TYPE_INTEGER, required=True),
    ],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['status'],
        properties={
            'status': openapi.Schema(type=openapi.TYPE_STRING, description='New status for the order (e.g., "pending", "processing", "shipped", "delivered", "cancelled")'),
        }
    ),
    responses={
        200: openapi.Response(
            description="Order status updated successfully",
            examples={
                'application/json': {
                    'data': {
                        'id': 1,
                        'status': 'processing',
                        'message': 'Order status updated successfully'
                    }
                }
            }
        ),
        400: openapi.Response(
            description="Bad request - Invalid status or order not found",
            examples={
                'application/json': {
                    'error': 'Invalid status value or order not found'
                }
            }
        ),
        401: openapi.Response(description="Unauthorized - Authentication credentials were not provided"),
        403: openapi.Response(description="Forbidden - User does not have staff permissions"),
    }
)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_order_status(request, order_id):
    """
    Update the status of a specific order (staff only)
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

@swagger_auto_schema(
    tags=['Authentication'],
    method='get',
    operation_description="Check if the current user has staff privileges",
    manual_parameters=[
        openapi.Parameter('Authorization', openapi.IN_HEADER, description="Bearer {token}", type=openapi.TYPE_STRING, required=True),
    ],
    responses={
        200: openapi.Response(
            description="Staff status checked successfully",
            examples={
                'application/json': {
                    'is_staff': True
                }
            }
        ),
        401: openapi.Response(description="Unauthorized - Authentication credentials were not provided"),
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_staff_status(request):
    """
    Check if the current authenticated user has staff privileges
    """
    is_staff = UserService.is_staff_user(request.user)
    return Response({"is_staff": is_staff}, status=status.HTTP_200_OK)
