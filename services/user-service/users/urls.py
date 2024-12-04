from django.urls import path
from .views import UsuariosViews, PacienteViews, MedicoViews

urlpatterns = [
    path('usuarios/', UsuariosViews.as_view(), name='usuarios'),
    path('usuarios/<int:pk>/', UsuariosViews.as_view(), name='usuarios'),
    path('pacientes/', PacienteViews.as_view(), name='pacientes'),
    path('pacientes/<int:pk>/', PacienteViews.as_view(), name='pacientes'),
    path('medicos/', MedicoViews.as_view(), name='medicos'),
    path('medicos/<int:pk>/', MedicoViews.as_view(), name='medicos'),
]

