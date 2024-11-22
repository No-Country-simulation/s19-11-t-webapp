from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Usuario, Paciente, Medico
from .serializers import UsuarioSerializer, PacienteSerializer, MedicoSerializer

class UsuariosViews(APIView):
    def get(self, request, id=0):
        if id > 0:
            usuario = Usuario.objects.get(pk=id)
            data = UsuarioSerializer(usuario).data
            return Response(data, status=status.HTTP_200_OK)
        usuarios = Usuario.objects.all()
        data = UsuarioSerializer(usuarios, many=True).data
        return Response(data, status=status.HTTP_200_OK)
    
    def post(self, request):
        usuario = UsuarioSerializer(data=request.data)
        if usuario.is_valid():
            usuario.save()
            return Response(usuario.data, status=status.HTTP_201_CREATED)
        return Response(usuario.errors, status=status.HTTP_400_BAD_REQUEST)
    
class PacienteViews(APIView):
    def get(self, request, id=0):
        if id > 0:
            paciente = Paciente.objects.get(pk=id)
            data = PacienteSerializer(paciente).data
            return Response(data, status=status.HTTP_200_OK)
        pacientes = Paciente.objects.all()
        data = PacienteSerializer(pacientes, many=True).data
        return Response(data, status=status.HTTP_200_OK)
    
    @transaction.atomic
    def post(self, request):
        data = request.data

        # Extraer datos para Usuario y Paciente
        usuario_data = {
            "email": data.get("email"),
            "contraseña": data.get("contraseña"),
            "nombre": data.get("nombre"),
            "apellido": data.get("apellido"),
            "telefono": data.get("telefono"),
        }
        paciente_data = {
            "documento": data.get("documento"),
            "direccion": data.get("direccion"),
            "fecha_nacimiento": data.get("fecha_nacimiento"),
            "genero": data.get("genero"),
            "numero_seguridad_social": data.get("numero_seguridad_social"),
            "historial_medico": data.get("historial_medico"),
        }

        # Crear Usuario
        try:
            usuario = Usuario.objects.create(**usuario_data)
        except Exception as e:
            return Response(
                {"error": "Error al crear el usuario", "detalles": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Crear Paciente
        try:
            Paciente.objects.create(id_usuario=usuario, **paciente_data)
        except Exception as e:
            # Si algo falla, se revierte la creación del Usuario
            transaction.set_rollback(True)
            return Response(
                {"error": "Error al crear el paciente", "detalles": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response({"message": "Paciente creado exitosamente"}, status=status.HTTP_201_CREATED)
    
class MedicoViews(APIView):
    def get(self, request, id=0):
        if id > 0:
            medico = Medico.objects.get(pk=id)
            data = MedicoSerializer(medico).data
            return Response(data, status=status.HTTP_200_OK)
        medicos = Medico.objects.all()
        data = MedicoSerializer(medicos, many=True).data
        return Response(data, status=status.HTTP_200_OK)

    @transaction.atomic
    def post(self, request):
        data = request.data

        # Extraer datos para Usuario y Medico
        usuario_data = {
            "email": data.get("email"),
            "contraseña": data.get("contraseña"),
            "nombre": data.get("nombre"),
            "apellido": data.get("apellido"),
            "telefono": data.get("telefono"),
        }
        medico_data = {
            "especialidad": data.get("especialidad"),
            "nro_matricula": data.get("nro_matricula"),
        }

        # Crear Usuario
        try:
            usuario = Usuario.objects.create(**usuario_data)
        except Exception as e:
            return Response(
                {"error": "Error al crear el usuario", "detalles": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Crear Medico
        try:
            Medico.objects.create(id_usuario=usuario, **medico_data)
        except Exception as e:
            # Si algo falla, se revierte la creación del Usuario
            transaction.set_rollback(True)
            return Response(
                {"error": "Error al crear el médico", "detalles": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response({"message": "Médico creado exitosamente"}, status=status.HTTP_201_CREATED)