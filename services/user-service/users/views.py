from django.db import transaction
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Usuario, Paciente, Medico
from .serializers import UsuarioSerializer, PacienteSerializer, MedicoSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

@method_decorator(csrf_exempt, name='dispatch')
class UsuariosViews(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description='Obtener una lista de todos los usuarios o un solo usuario por ID',
        responses={
            200: UsuarioSerializer(many=True),
            404: 'No encontrado'
        }
    )

    def get(self, request, id=0):
        '''
        Obtener una lista de todos los usuarios o un solo usuario por ID.
        '''
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
    

    @swagger_auto_schema(
        operation_description='Crear un nuevo usuario',
        request_body=UsuarioSerializer,
        responses={
            201: UsuarioSerializer,
            400: 'Solicitud incorrecta'
        }
    )

    def post(self, request):
        usuario_serializer = UsuarioSerializer(data=request.data)
        if usuario_serializer.is_valid():
            usuario_serializer.save()
            return Response(usuario_serializer.data, status=status.HTTP_201_CREATED)
        return Response(usuario_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class PacienteViews(APIView):
    permission_classes = [AllowAny]


    @swagger_auto_schema(
        operation_description='Obtener una lista de todos los pacientes o un solo paciente por ID',
        responses={
            200: PacienteSerializer(many=True),
            404: 'No encontrado'
        }
    )

    def get(self, request, id=0):
        '''
        Obtener una lista de todos los pacientes o un solo paciente por ID.
        '''
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
    

    @swagger_auto_schema(
        operation_description='Crear un nuevo paciente',
        request_body=PacienteSerializer,
        responses={
            201: PacienteSerializer,
            400: 'Solicitud incorrecta'
        }
    )

    @transaction.atomic
    def post(self, request):
        '''
        Crear un nuevo paciente.
        '''

        data = request.data

        # Usar el PacienteSerializer directamente
        serializer = PacienteSerializer(data=data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Guardar el paciente (esto también crea el usuario anidado)
        serializer.save()

        return Response({'message': 'Paciente creado exitosamente'}, status=status.HTTP_201_CREATED)

@method_decorator(csrf_exempt, name='dispatch')
class MedicoViews(APIView):
    @swagger_auto_schema(
        operation_description='Obtener una lista de todos los médicos o un solo médico por ID',
        responses={
            200: MedicoSerializer(many=True),
            404: 'No encontrado'
        }
    )

    def get(self, request, id=0):
        '''
        Obtener una lista de todos los médicos o un solo médico por ID.
        '''
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
    

    @swagger_auto_schema(
        operation_description='Crear un nuevo médico',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'nombre': openapi.Schema(type=openapi.TYPE_STRING, description='Nombre del médico'),
                'apellido': openapi.Schema(type=openapi.TYPE_STRING, description='Apellido del médico'),
                'especialidad': openapi.Schema(type=openapi.TYPE_STRING, description='Especialidad del médico'),
                'numero_licencia': openapi.Schema(type=openapi.TYPE_STRING, description='Número de licencia del médico')
            },
            required=['nombre', 'apellido', 'especialidad', 'numero_licencia']
        ),
        responses={
            201: MedicoSerializer,
            400: 'Solicitud incorrecta'
        }
    )

    @transaction.atomic
    def post(self, request):
        '''
        Crear un nuevo médico.
        '''

        data = request.data

        # Usar el MedicoSerializer directamente
        serializer = MedicoSerializer(data=data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Guardar el médico (esto también crea el usuario anidado)
        serializer.save()

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
