from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views
from api import views


urlpatterns = [
    path('products/', views.product_list, name='product_list'),
    path('orders/', views.order_list, name='order_list'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/details/', views.profile_details, name='profile_details'),
    path('profile/update/', views.update_profile, name='update_profile'),
    path('orders/history/', views.get_user_orders, name='order-history'),
]
