from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from api.services.product_service import ProductService
from api.models import Product
from api.serializers import ProductSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

@swagger_auto_schema(
    tags=['Products'],
    method='get',
    operation_description="Get all products in the system",
    responses={
        200: openapi.Response(description="List of products", schema=openapi.Schema(
            type=openapi.TYPE_ARRAY,
            items=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'id': openapi.Schema(type=openapi.TYPE_INTEGER),
                    'name': openapi.Schema(type=openapi.TYPE_STRING),
                    'description': openapi.Schema(type=openapi.TYPE_STRING),
                    'price': openapi.Schema(type=openapi.TYPE_NUMBER),
                    'stock': openapi.Schema(type=openapi.TYPE_INTEGER),
                }
            )
        )),
    }
)
@swagger_auto_schema(
    tags=['Products'],
    method='post',
    operation_description="Create a new product",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['name', 'price'],
        properties={
            'name': openapi.Schema(type=openapi.TYPE_STRING, description='Name of the product'),
            'description': openapi.Schema(type=openapi.TYPE_STRING, description='Description of the product'),
            'price': openapi.Schema(type=openapi.TYPE_NUMBER, description='Price of the product'),
            'stock': openapi.Schema(type=openapi.TYPE_INTEGER, description='Available stock quantity'),
        }
    ),
    responses={
        201: openapi.Response(
            description="Product successfully created",
            examples={
                'application/json': {
                    'id': 1,
                    'name': 'New Product',
                    'description': 'Product description',
                    'price': 19.99,
                    'stock': 100
                }
            }
        ),
        400: openapi.Response(
            description="Bad request - validation error",
            examples={
                'application/json': {
                    'error': 'Product name is required'
                }
            }
        ),
    }
)
@api_view(['GET', 'POST'])
def product_list(request):
    """
    List all products or create a new product
    
    GET: 
    Returns a list of all available products
    
    POST:
    Create a new product with the provided data
    """
    if request.method == 'GET':
        products = ProductService.get_all_products()
        return Response(products, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        result = ProductService.create_product(request.data)
        if result.get("error"):
            return Response(result, status=status.HTTP_400_BAD_REQUEST)
        return Response(result, status=status.HTTP_201_CREATED)

@swagger_auto_schema(
    tags=['Products'],
    method='get',
    operation_description="Get detailed information about a specific product",
    manual_parameters=[
        openapi.Parameter('product_id', openapi.IN_PATH, description="ID of the product", type=openapi.TYPE_INTEGER, required=True),
    ],
    responses={
        200: openapi.Response(
            description="Product details retrieved successfully",
            examples={
                'application/json': {
                    'id': 1,
                    'name': 'Sample Product',
                    'description': 'This is a sample product description',
                    'price': 29.99,
                    'stock': 50
                }
            }
        ),
        404: openapi.Response(
            description="Product not found",
            examples={
                'application/json': {
                    'error': 'Product not found'
                }
            }
        ),
    }
)
@api_view(['GET'])
def product_detail(request, product_id):
    """
    Retrieve detailed information about a specific product
    """
    try:
        product = Product.objects.get(pk=product_id)
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)