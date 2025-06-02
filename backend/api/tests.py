from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Product, Order, OrderItem

User = get_user_model()

class APITestSuite(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            password="testpassword",
            email="testuser@example.com"
        )
        self.client.force_authenticate(user=self.user)

        self.staff_user = User.objects.create_user(
            username="staffuser",
            password="staffpassword",
            email="staff@example.com",
            is_staff=True
        )

        self.product = Product.objects.create(
            name="Test Product",
            category="Test Category",
            price=10.99,
            stock=100
        )

        self.order = Order.objects.create(
            user=self.user,
            total_price=10.99,
            status="Pending"
        )
        OrderItem.objects.create(
            order=self.order,
            product=self.product,
            quantity=1
        )

        self.completed_order = Order.objects.create(
            user=self.user,
            total_price=21.98,
            status="Completed"
        )
        OrderItem.objects.create(
            order=self.completed_order,
            product=self.product,
            quantity=2
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
            "price": -15.99,  
            "stock": 50
        }
        response = self.client.post("/api/products/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_get_product_by_id(self):
        """Test pobierania pojedynczego produktu"""
        response = self.client.get(f"/api/products/{self.product.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Test Product")

    def test_get_product_by_category(self):
        """Test filtrowania produktów po kategorii"""
        response = self.client.get("/api/products/?category=Test%20Category")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)
        self.assertEqual(response.data[0]["category"], "Test Category")

    def test_get_orders(self):
        """Test poprawnego pobierania listy zamówień użytkownika"""
        response = self.client.get("/api/orders/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2) 

    def test_post_order(self):
        """Test poprawnego tworzenia zamówienia"""
        data = {
            "user": self.user.id,  
            "products": [],  
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
            "user": self.user.id,  
            "products": [],  
            "total_price": "69.00",
            "status": "Done", 
            "created_at": "2020-02-02T00:00:00Z"
        }
        response = self.client.post("/api/orders/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_post_order_with_products(self):
        """Test tworzenia zamówienia z produktami"""
        data = {
            "user": self.user.id,  
            "products": [{"product_id": self.product.id, "quantity": 3}],  
            "total_price": "32.97",
            "status": "Pending"
        }
        response = self.client.post("/api/orders/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["total_price"], "32.97")
    
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
            "email": "invalid-email"  
        }
        response = self.client.post("/api/profile/update/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_user_orders(self):
        """Test poprawnego pobierania historii zamówień użytkownika"""
        response = self.client.get("/api/orders/history/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Powinny być 2 zamówienia
        
    def test_get_user_orders_filtering(self):
        """Test filtrowania historii zamówień użytkownika po statusie"""
        response = self.client.get("/api/orders/history/?status=Completed")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
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
        data = {
            "username": self.user.username,
            "password": "testpassword"
        }
        response = self.client.post("/api/auth/token/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        refresh_token = response.data["refresh"]

        refresh_data = {
            "refresh": refresh_token
        }
        refresh_response = self.client.post("/api/auth/token/refresh/", refresh_data, format="json")
        self.assertEqual(refresh_response.status_code, status.HTTP_200_OK)
        self.assertIn("access", refresh_response.data)
        
    def test_invalid_refresh_token(self):
        """Test niepoprawnego odświeżenia tokenu dostępu"""
        refresh_data = {
            "refresh": "invalid_token"
        }
        response = self.client.post("/api/auth/token/refresh/", refresh_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_invalid_login(self):
        """Test niepoprawnego logowania"""
        data = {
            "username": self.user.username,
            "password": "wrongpassword"
        }
        response = self.client.post("/api/auth/token/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_all_orders_as_staff(self):
        """Test pobierania wszystkich zamówień jako pracownik"""
        self.client.force_authenticate(user=self.staff_user)
        response = self.client.get("/api/logistics/orders/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_get_all_orders_as_regular_user(self):
        """Test braku dostępu do wszystkich zamówień dla zwykłego użytkownika"""
        response = self.client.get("/api/logistics/orders/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
    def test_get_pending_orders_as_staff(self):
        """Test pobierania zamówień oczekujących jako pracownik"""
        self.client.force_authenticate(user=self.staff_user)
        response = self.client.get("/api/logistics/orders/pending/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_get_completed_orders_as_staff(self):
        """Test pobierania zrealizowanych zamówień jako pracownik"""
        self.client.force_authenticate(user=self.staff_user)
        response = self.client.get("/api/logistics/orders/completed/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_update_order_status_as_staff(self):
        """Test aktualizacji statusu zamówienia jako pracownik"""
        self.client.force_authenticate(user=self.staff_user)
        data = {"status": "Completed"}
        response = self.client.put(f"/api/logistics/orders/{self.order.id}/status/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_update_order_status_invalid_as_staff(self):
        """Test niepoprawnej aktualizacji statusu zamówienia jako pracownik"""
        self.client.force_authenticate(user=self.staff_user)
        data = {"status": "Invalid Status"}
        response = self.client.put(f"/api/logistics/orders/{self.order.id}/status/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_check_staff_status_as_staff(self):
        """Test sprawdzania statusu pracownika jako pracownik"""
        self.client.force_authenticate(user=self.staff_user)
        response = self.client.get("/api/auth/check-staff/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["is_staff"], True)
        
    def test_check_staff_status_as_regular_user(self):
        """Test sprawdzania statusu pracownika jako zwykły użytkownik"""
        response = self.client.get("/api/auth/check-staff/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["is_staff"], False)