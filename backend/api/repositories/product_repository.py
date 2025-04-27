from api.models import Product

class ProductRepository:
    @staticmethod
    def get_all_products():
        return Product.objects.all()

    @staticmethod
    def create_product(validated_data):
        return Product.objects.create(**validated_data)