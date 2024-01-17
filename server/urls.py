from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('client.urls')),  # Adjust the path as needed
    path("__debug__/", include("debug_toolbar.urls")),
]
