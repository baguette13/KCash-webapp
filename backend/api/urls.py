from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views
from api import views
from api.controllers import order_controller, product_controller, user_controller


urlpatterns = [
    #path('products/', views.product_list, name='product_list'),
    #path('orders/', views.order_list, name='order_list'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    #path('profile/details/', views.profile_details, name='profile_details'),
    #path('profile/update/', views.update_profile, name='update_profile'),
    #path('orders/history/', views.get_user_orders, name='order-history'),
    path('orders/history/', order_controller.get_user_orders, name='order-history'),
    path('products/', product_controller.product_list, name='product_list'),
    path('orders/', order_controller.order_list, name='order_list'),
    path('profile/details/', user_controller.profile_details, name='profile_details'),
    path('profile/update/', user_controller.update_profile, name='update_profile'),
]
