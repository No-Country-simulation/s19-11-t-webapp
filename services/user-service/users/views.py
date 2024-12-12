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

    def get(self, request, pk=0):
        '''
        Obtener una lista de todos los usuarios o un solo usuario por ID.
        '''
        if pk > 0:
            try:
                usuario = Usuario.objects.get(pk=pk)
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
    def get(self, request, pk=None):
        '''
        Obtener una lista de todos los pacientes o un solo paciente por ID.
        '''
        if pk is not None:
            try:
                paciente = Paciente.objects.get(pk=pk)
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
class AsignarHistorialMedicoView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description='Asignar un ID de historia clínica a un paciente',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'id_paciente': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID del paciente'),
                'historial_medico': openapi.Schema(type=openapi.TYPE_STRING, description='ID de la historia clínica')
            }
        ),
        responses={
            200: 'Historial médico asignado correctamente',
            400: 'Solicitud incorrecta',
            404: 'Paciente no encontrado'
        }
    )
    @transaction.atomic
    def post(self, request):
        '''
        Asignar un ID de historia clínica a un paciente.
        '''
        id_paciente = request.data.get('id_paciente')
        historial_medico = request.data.get('historial_medico')

        if not id_paciente or not historial_medico:
            return Response({'error': 'id_paciente y historial_medico son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            paciente = Paciente.objects.get(id_paciente=id_paciente)
        except Paciente.DoesNotExist:
            return Response({'error': 'Paciente no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        paciente.historial_medico = historial_medico
        paciente.save()

        return Response({'message': 'Historial médico asignado correctamente'}, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name='dispatch')
class MedicoViews(APIView):
    permission_classes = [AllowAny]
    
    @swagger_auto_schema(
        operation_description='Obtener una lista de todos los médicos o un solo médico por ID',
        responses={
            200: MedicoSerializer(many=True),
            404: 'No encontrado'
        }
    )

    def get(self, request, pk=0):
        '''
        Obtener una lista de todos los médicos o un solo médico por ID.
        '''
        if pk > 0:
            try:
                medico = Medico.objects.get(pk=pk)
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


@method_decorator(csrf_exempt, name='dispatch')
class MedicoByEspecialidadView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description='Obtener una lista de médicos por especialidad',
        responses={
            200: MedicoSerializer(many=True),
            404: 'No encontrado'
        }
    )

    def get(self, request, pk):
        '''
        Obtener una lista de médicos por especialidad.
        '''
        medicos = Medico.objects.filter(especialidad=pk)
        data = MedicoSerializer(medicos, many=True).data
        return Response(data, status=status.HTTP_200_OK)

