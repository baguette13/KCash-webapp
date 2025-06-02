# Test Coverage Report

## Endpoint Coverage Summary

| Endpoint | HTTP Method | Test Functions | Coverage |
|----------|-------------|----------------|---------|
| `/api/products/` | GET | `test_get_products`, `test_get_product_by_category` | ✅ |
| `/api/products/` | POST | `test_post_product`, `test_post_product_invalid` | ✅ |
| `/api/products/{id}/` | GET | `test_get_product_by_id` | ✅ |
| `/api/orders/` | GET | `test_get_orders` | ✅ |
| `/api/orders/` | POST | `test_post_order`, `test_post_order_invalid`, `test_post_order_with_products` | ✅ |
| `/api/orders/history/` | GET | `test_get_user_orders`, `test_get_user_orders_filtering` | ✅ |
| `/api/profile/details/` | GET | `test_get_profile_details` | ✅ |
| `/api/profile/update/` | POST | `test_update_profile`, `test_update_profile_invalid` | ✅ |
| `/api/auth/token/` | POST | `test_obtain_token`, `test_invalid_login` | ✅ |
| `/api/auth/token/refresh/` | POST | `test_refresh_token`, `test_invalid_refresh_token` | ✅ |
| `/api/logistics/orders/` | GET | `test_get_all_orders_as_staff`, `test_get_all_orders_as_regular_user` | ✅ |
| `/api/logistics/orders/pending/` | GET | `test_get_pending_orders_as_staff` | ✅ |
| `/api/logistics/orders/completed/` | GET | `test_get_completed_orders_as_staff` | ✅ |
| `/api/logistics/orders/{id}/status/` | PUT | `test_update_order_status_as_staff`, `test_update_order_status_invalid_as_staff` | ✅ |
| `/api/auth/check-staff/` | GET | `test_check_staff_status_as_staff`, `test_check_staff_status_as_regular_user` | ✅ |

## Total Test Count: 26

## Detailed Test Description

### Product Tests
1. `test_get_products` - Tests retrieving a list of products
2. `test_post_product` - Tests creating a valid product
3. `test_post_product_invalid` - Tests validation when creating an invalid product
4. `test_get_product_by_id` - Tests retrieving a single product by ID
5. `test_get_product_by_category` - Tests filtering products by category

### Order Tests
6. `test_get_orders` - Tests retrieving a list of user orders
7. `test_post_order` - Tests creating a valid order
8. `test_post_order_invalid` - Tests validation when creating an invalid order
9. `test_post_order_with_products` - Tests creating an order with associated products
10. `test_get_user_orders` - Tests retrieving order history for a user
11. `test_get_user_orders_filtering` - Tests filtering order history by status

### User Profile Tests
12. `test_get_profile_details` - Tests retrieving user profile information
13. `test_update_profile` - Tests updating user profile with valid data
14. `test_update_profile_invalid` - Tests validation when updating with invalid data

### Authentication Tests
15. `test_obtain_token` - Tests successful login and token acquisition
16. `test_refresh_token` - Tests refreshing an access token with a valid refresh token
17. `test_invalid_refresh_token` - Tests error handling with an invalid refresh token
18. `test_invalid_login` - Tests error handling with invalid login credentials

### Logistics Tests (Staff Only)
19. `test_get_all_orders_as_staff` - Tests staff access to all orders
20. `test_get_all_orders_as_regular_user` - Tests access restriction for non-staff users
21. `test_get_pending_orders_as_staff` - Tests retrieving pending orders as staff
22. `test_get_completed_orders_as_staff` - Tests retrieving completed orders as staff
23. `test_update_order_status_as_staff` - Tests updating order status as staff
24. `test_update_order_status_invalid_as_staff` - Tests validation when updating with invalid status
25. `test_check_staff_status_as_staff` - Tests staff status check for staff user
26. `test_check_staff_status_as_regular_user` - Tests staff status check for regular user

## Conclusion

All API endpoints are covered with at least one test. The test suite includes:

- Positive tests (testing correct behavior)
- Negative tests (testing error handling)
- Authentication/authorization tests
- Data validation tests

This comprehensive test coverage ensures that the API functions correctly and handles edge cases appropriately.

## Running the Tests

To run the tests, use the following command:

```bash
python manage.py test api.tests
```

Or in the Docker environment:

```bash
docker exec -it kcash-backend bash
python manage.py test api.tests
```
