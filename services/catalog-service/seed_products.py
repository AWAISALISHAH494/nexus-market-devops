import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from products.models import Category, Product

# Create Category
category, _ = Category.objects.get_or_create(
    name="Electronics",
    defaults={"description": "Electronic gadgets and devices", "slug": "electronics"}
)

products_data = [
    {
        "name": "Wireless Noise-Cancelling Headphones",
        "description": "High-quality wireless headphones with active noise cancellation and 30-hour battery life.",
        "price": 199.99,
        "compare_price": 249.99,
        "category": category,
        "seller_id": 1,
        "stock": 50,
        "sku": "ELEC-WH-001",
        "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
    },
    {
        "name": "Smart Watch Pro",
        "description": "Fitness tracker with heart rate monitor, sleep tracking, and waterproof design.",
        "price": 129.50,
        "category": category,
        "seller_id": 1,
        "stock": 120,
        "sku": "ELEC-SW-002",
        "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"
    },
    {
        "name": "4K Action Camera",
        "description": "Capture your adventures in stunning 4K resolution. Includes waterproof casing and mounts.",
        "price": 89.99,
        "compare_price": 119.99,
        "category": category,
        "seller_id": 1,
        "stock": 15,
        "sku": "ELEC-CAM-003",
        "image": "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80"
    },
    {
        "name": "Portable Bluetooth Speaker",
        "description": "Compact and powerful speaker with deep bass and 12-hour playtime.",
        "price": 45.00,
        "category": category,
        "seller_id": 1,
        "stock": 200,
        "sku": "ELEC-SPK-004",
        "image": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80"
    }
]

added = 0
for p_data in products_data:
    obj, created = Product.objects.get_or_create(sku=p_data["sku"], defaults=p_data)
    if created:
        added += 1

print(f"{added} Products added successfully!")
