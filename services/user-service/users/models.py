from django.db import models
from .Manager import UsuarioManager
from django.contrib.auth.models import AbstractUser

class Usuario(AbstractUser):
    email = models.EmailField(unique=True)  # El email debe ser único
    telefono = models.CharField(max_length=15, blank=True, null=True)

    username = None  # Eliminamos el campo username, ya no será necesario.

    USERNAME_FIELD = 'email'  # Configuramos el email como identificador único.
    REQUIRED_FIELDS = []  # Aquí puedes agregar campos obligatorios adicionales, como `first_name` o `last_name`.

    objects = UsuarioManager()  # Asignamos el manager personalizado.

    class Meta:
        db_table = 'usuario'
        managed = True

    def __str__(self):
        return f'{self.email} {self.first_name} {self.last_name}'
    
class Paciente(models.Model):
    id_paciente = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)  # Elimina db_column
    documento = models.CharField(max_length=15)
    direccion = models.CharField(max_length=100)
    fecha_nacimiento = models.DateField()
    genero = models.CharField(max_length=1)
    numero_seguridad_social = models.CharField(max_length=15)
    historial_medico = models.IntegerField(null=True)

    class Meta:
        db_table = 'paciente'
        managed = True

    def __str__(self):
        return self.id_usuario.first_name + self.id_usuario.last_name


class Medico(models.Model):
    id_medico = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)  # Elimina db_column
    especialidad = models.CharField(max_length=50)
    nro_matricula = models.CharField(max_length=15)

    class Meta:
        db_table = 'medico'
        managed = True

    def __str__(self):
        return self.id_usuario.first_name + self.id_usuario.last_name
