from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Product, Order

User = get_user_model()

class APITestSuite(APITestCase):
    def setUp(self):
        # Tworzenie użytkownika testowego
        self.user = User.objects.create_user(
            username="testuser",
            password="testpassword",
            email="testuser@example.com"
        )
        self.client.force_authenticate(user=self.user)

        # Tworzenie przykładowych danych
        self.product = Product.objects.create(
            name="Test Product",
            category="Test Category",
            price=10.99,
            stock=100
        )

    def test_get_products(self):
        """Test poprawnego pobierania listy produktów"""
        response = self.client.get("/api/products/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)

    def test_post_product(self):
        """Test poprawnego tworzenia produktu"""
        data = {
            "name": "New Product",
            "category": "New Category",
            "price": 15.99,
            "stock": 50
        }
        response = self.client.post("/api/products/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], "New Product")

    def test_post_product_invalid(self):
        """Test niepoprawnego tworzenia produktu"""
        data = {
            "name": "",
            "category": "New Category",
            "price": -15.99,  # Niepoprawna cena
            "stock": 50
        }
        response = self.client.post("/api/products/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_orders(self):
        """Test poprawnego pobierania listy zamówień użytkownika"""
        response = self.client.get("/api/orders/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_post_order(self):
        """Test poprawnego tworzenia zamówienia"""
        data = {
            "user": self.user.id,  # Przekazanie ID użytkownika
            "products": [],  # Pusta lista produktów
            "total_price": "69.00",
            "status": "Pending",
            "created_at": "2020-02-02T00:00:00Z"
        }
        response = self.client.post("/api/orders/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], "Pending")

    def test_post_order_invalid(self):
        """Test niepoprawnego tworzenia zamówienia"""
        data = {
            "user": self.user.id,  # Przekazanie ID użytkownika
            "products": [],  
            "total_price": "69.00",
            "status": "Done", #niepoprawny status
            "created_at": "2020-02-02T00:00:00Z"
        }
        response = self.client.post("/api/orders/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_profile_details(self):
        """Test poprawnego pobierania szczegółów profilu"""
        response = self.client.get("/api/profile/details/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], self.user.username)

    def test_update_profile(self):
        """Test poprawnej aktualizacji profilu"""
        data = {
            "first_name": "Updated",
            "last_name": "User",
            "email": "updated@example.com"
        }
        response = self.client.post("/api/profile/update/", data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, "Updated")

    def test_update_profile_invalid(self):
        """Test niepoprawnej aktualizacji profilu"""
        data = {
            "email": "invalid-email"  # Niepoprawny email
        }
        response = self.client.post("/api/profile/update/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


    def test_get_user_orders(self):
        """Test poprawnego pobierania historii zamówień użytkownika"""
        # Tworzenie przykładowego zamówienia
        order = Order.objects.create(
            user=self.user,
            total_price=100.00,
            status="Completed"
        )
        response = self.client.get("/api/orders/history/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], order.id)
        self.assertEqual(response.data[0]["status"], "Completed")

    def test_obtain_token(self):
        """Test poprawnego uzyskania tokenu dostępu"""
        data = {
            "username": self.user.username,
            "password": "testpassword"
        }
        response = self.client.post("/api/auth/token/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_refresh_token(self):
        """Test poprawnego odświeżenia tokenu dostępu"""
        # Uzyskanie tokenu dostępu i odświeżenia
        data = {
            "username": self.user.username,
            "password": "testpassword"
        }
        response = self.client.post("/api/auth/token/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        refresh_token = response.data["refresh"]

        # Odświeżenie tokenu dostępu
        refresh_data = {
            "refresh": refresh_token
        }
        refresh_response = self.client.post("/api/auth/token/refresh/", refresh_data, format="json")
        self.assertEqual(refresh_response.status_code, status.HTTP_200_OK)
        self.assertIn("access", refresh_response.data)
#docker ps
#docker exec -it kcash-backedn bash
#python manage.py test api.tests