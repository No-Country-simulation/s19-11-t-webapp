from django.db import transaction, IntegrityError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Usuario, Paciente, Medico
from .serializers import UsuarioSerializer, PacienteSerializer, MedicoSerializer


class UsuariosViews(APIView):
    def get(self, request, id=0):
        if id > 0:
            try:
                usuario = Usuario.objects.get(pk=id)
                data = UsuarioSerializer(usuario).data
                return Response(data, status=status.HTTP_200_OK)
            except Usuario.DoesNotExist:
                return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        usuarios = Usuario.objects.all()
        data = UsuarioSerializer(usuarios, many=True).data
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        usuario_serializer = UsuarioSerializer(data=request.data)
        if usuario_serializer.is_valid():
            usuario_serializer.save()
            return Response(usuario_serializer.data, status=status.HTTP_201_CREATED)
        return Response(usuario_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PacienteViews(APIView):
    def get(self, request, id=0):
        if id > 0:
            try:
                paciente = Paciente.objects.get(pk=id)
                data = PacienteSerializer(paciente).data
                return Response(data, status=status.HTTP_200_OK)
            except Paciente.DoesNotExist:
                return Response({'error': 'Paciente no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        pacientes = Paciente.objects.all()
        data = PacienteSerializer(pacientes, many=True).data
        return Response(data, status=status.HTTP_200_OK)
    
    @transaction.atomic
    def post(self, request):
        data = request.data

        # Extraer datos para Usuario y Paciente
        usuario_data = {
            'email': data.get('email'),
            'password': data.get('password'),
            'first_name': data.get('first_name'),
            'last_name': data.get('last_name'),
            'telefono': data.get('telefono'),
        }
        paciente_data = {
            'documento': data.get('documento'),
            'direccion': data.get('direccion'),
            'fecha_nacimiento': data.get('fecha_nacimiento'),
            'genero': data.get('genero'),
            'numero_seguridad_social': data.get('numero_seguridad_social'),
            'historial_medico': data.get('historial_medico'),
        }

        try:
            # Crear Usuario
            usuario_serializer = UsuarioSerializer(data=usuario_data)
            if not usuario_serializer.is_valid():
                return Response(usuario_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # Guardar Usuario en la base de datos
            usuario = usuario_serializer.save()

            # Crear Paciente
            paciente_data['id_usuario'] = usuario.id
            paciente_serializer = PacienteSerializer(data=paciente_data)
            if not paciente_serializer.is_valid():
                return Response(paciente_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # Guardar Paciente en la base de datos
            paciente_serializer.save()

        except IntegrityError:
            # Si algo falla (por ejemplo, violación de integridad de la base de datos), revertir la transacción
            return Response({'error': 'Hubo un error al crear el usuario o el paciente'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'message': 'Paciente creado exitosamente'}, status=status.HTTP_201_CREATED)


class MedicoViews(APIView):
    def get(self, request, id=0):
        if id > 0:
            try:
                medico = Medico.objects.get(pk=id)
                data = MedicoSerializer(medico).data
                return Response(data, status=status.HTTP_200_OK)
            except Medico.DoesNotExist:
                return Response({'error': 'Médico no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        medicos = Medico.objects.all()
        data = MedicoSerializer(medicos, many=True).data
        return Response(data, status=status.HTTP_200_OK)
    
    @transaction.atomic
    def post(self, request):
        data = request.data

        # Extraer datos para Usuario y Médico
        usuario_data = {
            'email': data.get('email'),
            'password': data.get('password'),
            'first_name': data.get('first_name'),
            'last_name': data.get('last_name'),
            'telefono': data.get('telefono'),
        }
        medico_data = {
            'especialidad': data.get('especialidad'),
            'nro_matricula': data.get('nro_matricula'),
        }

        # Crear Usuario
        usuario_serializer = UsuarioSerializer(data=usuario_data)
        if not usuario_serializer.is_valid():
            return Response(usuario_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        usuario = usuario_serializer.save()

        # Crear Médico
        medico_data['id_usuario'] = usuario.id
        medico_serializer = MedicoSerializer(data=medico_data)
        if not medico_serializer.is_valid():
            return Response(medico_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        medico_serializer.save()

        return Response({'message': 'Médico creado exitosamente'}, status=status.HTTP_201_CREATED)

    def get(self, request, id=0):
        if id > 0:
            try:
                medico = Medico.objects.get(pk=id)
                data = MedicoSerializer(medico).data
                return Response(data, status=status.HTTP_200_OK)
            except Medico.DoesNotExist:
                return Response({'error': 'Médico no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        medicos = Medico.objects.all()
        data = MedicoSerializer(medicos, many=True).data
        return Response(data, status=status.HTTP_200_OK)

class VerifyUserViews(APIView):
    def post(self, request):
        data = request.data
        email = data.get('email')
        password = data.get('password')

        try:
            usuario = Usuario.objects.get(email=email)
            if usuario.check_password(password):
                return Response({'message': 'Usuario autenticado'}, status=status.HTTP_200_OK)
            return Response({'error': 'Contraseña incorrecta'}, status=status.HTTP_400_BAD_REQUEST)
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)