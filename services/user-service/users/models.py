from django.db import models
from django.contrib.auth.models import AbstractUser

class Usuario(AbstractUser):
    telefono = models.CharField(max_length=15)

    class Meta:
        db_table = 'usuario'
        managed = True

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
class Paciente(models.Model):
    id_paciente = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(Usuario, db_column='id_usuario', on_delete=models.CASCADE)
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
        return self.id_usuario.nombre + self.id_usuario.apellido

class Medico(models.Model):
    id_medico = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(Usuario, db_column='id_usuario', on_delete=models.CASCADE)
    especialidad = models.CharField(max_length=50)
    nro_matricula = models.CharField(max_length=15)

    class Meta:
        db_table = 'medico'
        managed = True

    def __str__(self):
        return self.id_usuario.nombre + self.id_usuario.apellido
