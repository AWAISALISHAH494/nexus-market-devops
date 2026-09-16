from django.urls import path
from .views import (
    ProductListCreateView, ProductDetailView,
    ProductSearchView, ProductByCategoryView,
    CategoryListView, CategoryDetailView
)

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='category-detail'),
    path('category/<slug:slug>/', ProductByCategoryView.as_view(), name='product-by-category'),
    path('search/', ProductSearchView.as_view(), name='product-search'),
    path('', ProductListCreateView.as_view(), name='product-list-create'),
    path('<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
]
