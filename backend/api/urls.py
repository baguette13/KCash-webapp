from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views
from api import views
from api.controllers import order_controller, product_controller, user_controller, logistics_controller


urlpatterns = [

    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('orders/history/', order_controller.get_user_orders, name='order-history'),
    path('products/', product_controller.product_list, name='product_list'),
    path('products/<int:product_id>/', product_controller.product_detail, name='product_detail'),
    path('orders/', order_controller.order_list, name='order_list'),
    path('profile/details/', user_controller.profile_details, name='profile_details'),
    path('profile/update/', user_controller.update_profile, name='update_profile'),
    
    path('logistics/orders/', logistics_controller.get_all_orders, name='logistics-orders-all'),
    path('logistics/orders/pending/', logistics_controller.get_pending_orders, name='logistics-orders-pending'),
    path('logistics/orders/completed/', logistics_controller.get_completed_orders, name='logistics-orders-completed'),
    path('logistics/orders/<int:order_id>/status/', logistics_controller.update_order_status, name='logistics-order-status'),
    path('auth/check-staff/', logistics_controller.check_staff_status, name='check-staff-status'),
]
