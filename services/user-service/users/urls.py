from django.urls import path
from .views import UsuariosViews, PacienteViews, MedicoViews, MedicoByEspecialidadView, AsignarHistorialMedicoView

urlpatterns = [
    path('usuarios/', UsuariosViews.as_view(), name='usuarios'),
    path('usuarios/<int:pk>/', UsuariosViews.as_view(), name='usuarios'),
    path('pacientes/', PacienteViews.as_view(), name='pacientes'),
    path('pacientes/<int:pk>/', PacienteViews.as_view(), name='pacientes'),
    path('pacientes/asignar-historial/', AsignarHistorialMedicoView.as_view(), name='asignar-historial-medico'),
    path('medicos/', MedicoViews.as_view(), name='medicos'),
    path('medicos/<int:pk>/', MedicoViews.as_view(), name='medicos'),
    path('medicos/especialidad/<int:pk>/', MedicoByEspecialidadView.as_view(), name='medicos'),

]
