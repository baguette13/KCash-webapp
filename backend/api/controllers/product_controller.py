from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from api.services.product_service import ProductService

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