from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name=''),
    path('info/', views.info, name='info'),
    path('clubs/', views.clubs, name='clubs'),
    path('calendar/', views.calendar, name='calendar'),
    path('calendar/edit/', views.editable_calendar, name='editable_calendar'),
    path('data/add-event/', views.add_event, name='add_event'),
]
