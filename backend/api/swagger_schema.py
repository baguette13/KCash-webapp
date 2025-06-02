from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_yasg.utils import swagger_auto_schema

schema_view = get_schema_view(
    openapi.Info(
        title="KCash API Documentation",
        default_version='v1',
        description="""
# KCash API Documentation

This API provides endpoints for user authentication, product management, order processing, and logistics operations.

## Authentication
All protected endpoints require a valid JWT token in the Authorization header:
`Authorization: Bearer {token}`

## Response Codes
- **200 OK**: The request was successful
- **201 Created**: A new resource was successfully created
- **400 Bad Request**: The request was invalid or cannot be served
- **401 Unauthorized**: Authentication is required and has failed or not been provided
- **403 Forbidden**: The request is understood, but it has been refused or access is not allowed
- **404 Not Found**: The requested resource does not exist
- **422 Unprocessable Entity**: The request was well-formed but semantically invalid
- **500 Internal Server Error**: Server error occurred
        """,
        terms_of_service="https://www.kcash.com/terms/",
        contact=openapi.Contact(email="contact@kcash.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

token_obtain_schema = swagger_auto_schema(
    tags=['Authentication'],
    operation_description="Obtain JWT token pair (access and refresh tokens) by providing valid credentials",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['username', 'password'],
        properties={
            'username': openapi.Schema(type=openapi.TYPE_STRING, description='Username'),
            'password': openapi.Schema(type=openapi.TYPE_STRING, description='Password'),
        }
    ),
    responses={
        200: openapi.Response(
            description="Token pair obtained successfully",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'access': openapi.Schema(type=openapi.TYPE_STRING, description='Access token'),
                    'refresh': openapi.Schema(type=openapi.TYPE_STRING, description='Refresh token'),
                }
            ),
            examples={
                'application/json': {
                    'access': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl...',
                    'refresh': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl...'
                }
            }
        ),
        401: openapi.Response(
            description="Invalid credentials",
            examples={
                'application/json': {
                    'detail': 'No active account found with the given credentials'
                }
            }
        ),
    },
)

token_refresh_schema = swagger_auto_schema(
    tags=['Authentication'],
    operation_description="Refresh access token using a valid refresh token",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['refresh'],
        properties={
            'refresh': openapi.Schema(type=openapi.TYPE_STRING, description='Refresh token'),
        }
    ),
    responses={
        200: openapi.Response(
            description="Access token refreshed successfully",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'access': openapi.Schema(type=openapi.TYPE_STRING, description='New access token'),
                }
            ),
            examples={
                'application/json': {
                    'access': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl...'
                }
            }
        ),
        401: openapi.Response(
            description="Invalid or expired refresh token",
            examples={
                'application/json': {
                    'detail': 'Token is invalid or expired',
                    'code': 'token_not_valid'
                }
            }
        ),
    },
)

TokenObtainPairView = token_obtain_schema(TokenObtainPairView)
TokenRefreshView = token_refresh_schema(TokenRefreshView)
