import jwt
from django.conf import settings
from rest_framework import generics, permissions
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import AuthenticationFailed, PermissionDenied
from django.db.models import Q
from .models import Category, Product
from .serializers import (
    CategorySerializer, ProductListSerializer, 
    ProductDetailSerializer, ProductCreateUpdateSerializer
)
from rest_framework.authentication import BaseAuthentication


class IsSellerOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['seller', 'admin']
        )

class ProductPagination(PageNumberPagination):
    page_size = 12

class ProductListCreateView(generics.ListCreateAPIView):
    pagination_class = ProductPagination
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProductCreateUpdateSerializer
        return ProductListSerializer

    def get_queryset(self):
        return Product.objects.filter(is_active=True)

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsSellerOrAdmin()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(seller_id=self.request.user.id)

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ProductCreateUpdateSerializer
        return ProductDetailSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsSellerOrAdmin()]
        return [permissions.AllowAny()]

    def perform_update(self, serializer):
        obj = self.get_object()
        if self.request.user.role != 'admin' and obj.seller_id != self.request.user.id:
            raise PermissionDenied("You do not own this product.")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user.role != 'admin' and instance.seller_id != self.request.user.id:
            raise PermissionDenied("You do not own this product.")
        instance.delete()

class ProductSearchView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    pagination_class = ProductPagination
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        query = self.request.query_params.get('q', '')
        if query:
            return Product.objects.filter(
                Q(name__icontains=query) | Q(description__icontains=query),
                is_active=True
            )
        return Product.objects.none()

class ProductByCategoryView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    pagination_class = ProductPagination
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        slug = self.kwargs.get('slug')
        return Product.objects.filter(category__slug=slug, is_active=True)

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.filter(parent__isnull=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class CategoryDetailView(generics.RetrieveAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
