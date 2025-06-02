from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from api.services.order_service import OrderService
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

@swagger_auto_schema(
    tags=['Orders'],
    method='get',
    operation_description="Get all orders for the current authenticated user",
    manual_parameters=[
        openapi.Parameter('Authorization', openapi.IN_HEADER, description="Bearer {token}", type=openapi.TYPE_STRING, required=True),
    ],
    responses={
        200: openapi.Response(
            description="List of user's orders",
            examples={
                'application/json': [{
                    'id': 1,
                    'date_created': '2025-06-01T12:00:00Z',
                    'total_price': 49.98,
                    'status': 'pending',
                    'user': 'username',
                    'items': [{
                        'product_id': 1,
                        'product_name': 'Sample Product',
                        'quantity': 2,
                        'price': 24.99
                    }]
                }]
            }
        ),
        401: openapi.Response(description="Unauthorized - Authentication credentials were not provided"),
    }
)
@swagger_auto_schema(
    tags=['Orders'],
    method='post',
    operation_description="Create a new order for the current authenticated user",
    manual_parameters=[
        openapi.Parameter('Authorization', openapi.IN_HEADER, description="Bearer {token}", type=openapi.TYPE_STRING, required=True),
    ],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['products'],
        properties={
            'products': openapi.Schema(
                type=openapi.TYPE_ARRAY,
                items=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    required=['product_id', 'quantity'],
                    properties={
                        'product_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID of the product'),
                        'quantity': openapi.Schema(type=openapi.TYPE_INTEGER, description='Quantity to order'),
                    }
                )
            ),
            'delivery_address': openapi.Schema(type=openapi.TYPE_STRING, description='Delivery address for the order'),
        }
    ),
    responses={
        201: openapi.Response(
            description="Order successfully created",
            examples={
                'application/json': {
                    'id': 1,
                    'date_created': '2025-06-01T14:30:00Z',
                    'total_price': 99.95,
                    'status': 'pending',
                    'message': 'Order created successfully'
                }
            }
        ),
        400: openapi.Response(
            description="Bad request - validation error",
            examples={
                'application/json': {
                    'error': 'Invalid product ID or insufficient stock'
                }
            }
        ),
        401: openapi.Response(description="Unauthorized - Authentication credentials were not provided"),
    }
)
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def order_list(request):
    """
    List all orders for the current user or create a new order
    
    GET:
    Returns a list of all orders made by the authenticated user
    
    POST:
    Create a new order with the provided products
    """
    if request.method == 'GET':
        orders = OrderService.get_user_orders(request.user)
        return Response(orders, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        result = OrderService.create_order(request.user, request.data)
        if result.get("error"):
            return Response(result, status=status.HTTP_400_BAD_REQUEST)
        return Response(result, status=status.HTTP_201_CREATED)

@swagger_auto_schema(
    tags=['Orders'],
    method='get',
    operation_description="Get order history for the current authenticated user with optional status filtering",
    manual_parameters=[
        openapi.Parameter('Authorization', openapi.IN_HEADER, description="Bearer {token}", type=openapi.TYPE_STRING, required=True),
        openapi.Parameter('status', openapi.IN_QUERY, description="Filter orders by status (e.g., 'pending', 'processing', 'shipped', 'delivered', 'cancelled')", type=openapi.TYPE_STRING, required=False),
    ],
    responses={
        200: openapi.Response(
            description="List of user's orders filtered by status if provided",
            examples={
                'application/json': [{
                    'id': 1,
                    'date_created': '2025-05-15T10:30:00Z',
                    'total_price': 149.90,
                    'status': 'delivered',
                    'items': [{
                        'product_id': 3,
                        'product_name': 'Premium Product',
                        'quantity': 1,
                        'price': 149.90
                    }]
                }]
            }
        ),
        401: openapi.Response(description="Unauthorized - Authentication credentials were not provided"),
    }
)  
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_orders(request):
    """
    Retrieve order history for the current authenticated user
    
    Optional query parameter:
    - status: Filter orders by status (e.g., 'pending', 'completed')
    """
    status_filter = request.GET.get('status')
    user_orders = OrderService.get_user_orders(request.user, status_filter)
    return Response(user_orders, status=status.HTTP_200_OK)