from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from rest_framework import status

User = get_user_model()

class UserAuthTests(APITestCase):
    def setUp(self):
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'strongpassword123',
            'first_name': 'Test',
            'last_name': 'User'
        }

    def test_user_registration(self):
        url = '/api/auth/register/'
        response = self.client.post(url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['username'], self.user_data['username'])
        self.assertEqual(User.objects.count(), 1)

    def test_user_login(self):
        # Register first
        User.objects.create_user(**self.user_data)
        
        url = '/api/auth/login/'
        login_data = {
            'username': 'testuser',
            'password': 'strongpassword123'
        }
        response = self.client.post(url, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_get_user_profile(self):
        user = User.objects.create_user(**self.user_data)
        self.client.force_authenticate(user=user)
        
        url = '/api/auth/profile/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')
