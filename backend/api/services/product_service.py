from api.repositories.product_repository import ProductRepository
from api.serializers import ProductSerializer

class ProductService:
    @staticmethod
    def get_all_products():
        products = ProductRepository.get_all_products()
        serializer = ProductSerializer(products, many=True)
        return serializer.data

    @staticmethod
    def create_product(data):
        serializer = ProductSerializer(data=data)
        if serializer.is_valid():
            product = ProductRepository.create_product(serializer.validated_data)
            return ProductSerializer(product).data
        return {"error": serializer.errors}