from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ('email', 'username', 'role', 'is_staff', 'is_active', 'created_at')
    list_filter = ('email', 'username', 'role', 'is_staff', 'is_active')
    search_fields = ('email', 'username', 'role')
    ordering = ('-created_at',)
    
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Profile', {'fields': ('role', 'phone', 'address', 'avatar')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Custom Profile', {'fields': ('email', 'role', 'phone', 'address', 'avatar')}),
    )

admin.site.register(User, CustomUserAdmin)
