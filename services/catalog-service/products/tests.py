from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Category, Product

User = get_user_model()

class ProductTests(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(
            name="Electronics",
            slug="electronics",
            description="Electronic devices"
        )
        self.product = Product.objects.create(
            category=self.category,
            name="Smartphone",
            slug="smartphone",
            description="A very smart phone",
            price=599.99,
            stock=100,
            is_active=True,
            seller_id=1,
            sku="PHONE-123"
        )
        
        # We need an admin user to test creation
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpassword'
        )
        # Mock the role attribute that would normally come from the JWT token
        self.admin_user.role = 'admin'

    def test_get_products_list(self):
        url = '/api/products/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should return paginated results, checking 'results'
        self.assertGreaterEqual(len(response.data.get('results', response.data)), 1)
        
    def test_get_product_detail(self):
        url = f'/api/products/{self.product.id}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Smartphone')
        
    def test_create_product_unauthorized(self):
        url = '/api/products/'
        data = {
            'category': self.category.id,
            'name': 'Laptop',
            'slug': 'laptop',
            'price': 999.99,
            'stock': 50,
            'seller_id': 1
        }
        response = self.client.post(url, data, format='json')
        # DRF returns 403 Forbidden or 401 Unauthorized depending on auth setup
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])
        
    def test_create_product_admin(self):
        url = '/api/products/'
        data = {
            'category': self.category.id,
            'name': 'Laptop',
            'slug': 'laptop',
            'price': 999.99,
            'stock': 50,
            'seller_id': 1
        }
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Product.objects.count(), 2)
