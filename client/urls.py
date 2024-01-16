from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.home, name=''),
    path('info/', views.info, name='info'),
    path('clubs/', views.clubs, name='clubs'),
    path('calendar/', views.calendar, name='calendar'),
    # For the calendar-related URLs
    path('calendar/', include([
        path('', views.calendar, name='calendar'),
        path('edit/', views.editable_calendar, name='editable_calendar'),
        path('accounts/', include('allauth.urls')),  # Include allauth urls under calendar
    ])),
    path('data/add-event/', views.add_event, name='add_event'),
]
