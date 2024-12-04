from django.contrib import admin
from .models import Usuario, Paciente, Medico

class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'is_active', 'is_superuser', 'is_staff')  # Asegúrate de poner los campos que te interesan
    search_fields = ('email', 'first_name', 'last_name')

admin.site.register(Usuario, UsuarioAdmin)
admin.site.register(Paciente)
admin.site.register(Medico)
