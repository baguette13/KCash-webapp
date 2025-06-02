from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from api.services.user_service import UserService
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

@swagger_auto_schema(
    tags=['User'],
    method='get',
    operation_description="Get profile details for the current authenticated user",
    manual_parameters=[
        openapi.Parameter('Authorization', openapi.IN_HEADER, description="Bearer {token}", type=openapi.TYPE_STRING, required=True),
    ],
    responses={
        200: openapi.Response(
            description="User profile details retrieved successfully",
            examples={
                'application/json': {
                    'id': 1,
                    'username': 'testuser',
                    'email': 'test@example.com',
                    'first_name': 'Test',
                    'last_name': 'User',
                    'address': '123 Test Street'
                }
            }
        ),
        401: openapi.Response(description="Unauthorized - Authentication credentials were not provided"),
    }
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile_details(request):
    """
    Get profile details for the current authenticated user
    """
    user = UserService.get_user_details(request.user)
    return Response(user, status=status.HTTP_200_OK)

@swagger_auto_schema(
    tags=['User'],
    method='post',
    operation_description="Update profile details for the current authenticated user",
    manual_parameters=[
        openapi.Parameter('Authorization', openapi.IN_HEADER, description="Bearer {token}", type=openapi.TYPE_STRING, required=True),
    ],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'first_name': openapi.Schema(type=openapi.TYPE_STRING, description='First name of the user'),
            'last_name': openapi.Schema(type=openapi.TYPE_STRING, description='Last name of the user'),
            'email': openapi.Schema(type=openapi.TYPE_STRING, description='Email address of the user'),
            'address': openapi.Schema(type=openapi.TYPE_STRING, description='Delivery address of the user'),
        }
    ),
    responses={
        200: openapi.Response(
            description="User profile updated successfully",
            examples={
                'application/json': {
                    'id': 1,
                    'username': 'testuser',
                    'email': 'updated@example.com',
                    'first_name': 'Updated',
                    'last_name': 'User',
                    'address': '456 New Address'
                }
            }
        ),
        400: openapi.Response(
            description="Bad request - validation error",
            examples={
                'application/json': {
                    'error': 'Email address is invalid'
                }
            }
        ),
        401: openapi.Response(description="Unauthorized - Authentication credentials were not provided"),
    }
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """
    Update profile details for the current authenticated user
    """
    result = UserService.update_user_profile(request.user, request.data)
    if result.get("error"):
        return Response(result, status=status.HTTP_400_BAD_REQUEST)
    return Response(result, status=status.HTTP_200_OK)