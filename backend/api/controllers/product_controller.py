from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from api.services.product_service import ProductService
from api.models import Product
from api.serializers import ProductSerializer

@api_view(['GET', 'POST'])
def product_list(request):
    if request.method == 'GET':
        products = ProductService.get_all_products()
        return Response(products, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        result = ProductService.create_product(request.data)
        if result.get("error"):
            return Response(result, status=status.HTTP_400_BAD_REQUEST)
        return Response(result, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def product_detail(request, product_id):
    """
    Endpoint to get product details by ID
    """
    try:
        product = Product.objects.get(pk=product_id)
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)