from django.urls import path
from .views import EspecialidadView

urlpatterns = [
    path('especialidades/', EspecialidadView.as_view(), name='especialidades'),
    path('especialidades/<int:pk>/', EspecialidadView.as_view(), name='especialidades'),
]
