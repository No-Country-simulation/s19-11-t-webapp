from rest_framework.views import APIView
from rest_framework.response import Response  
from rest_framework import status
from .models import Especialidad
from .serializers import EspecialidadSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class EspecialidadView(APIView):
    '''
    Devuelve las especialidades disponibles, o crea una nueva especialidad. Además, permite obtener una especialidad por ID.
    '''
    @swagger_auto_schema(
        operation_description='Obtener una lista de todas las especialidades o una sola especialidad por ID',
        responses={
            200: EspecialidadSerializer(many=True),
            404: 'No encontrado'
        }
    )
    def get(self, request, id=0):
        '''
        Obtener una lista de todas las especialidades o una sola especialidad por ID.
        '''
        if id > 0:
            try:
                especialidad = Especialidad.objects.get(pk=id)
                especialidad_serializer = EspecialidadSerializer(especialidad)
                return Response(especialidad_serializer.data)
            except Especialidad.DoesNotExist:
                return Response({'error': 'Especialidad no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        else:
            especialidades = Especialidad.objects.all()
            especialidades_serializer = EspecialidadSerializer(especialidades, many=True)
            return Response(especialidades_serializer.data)
    
    @swagger_auto_schema(
        operation_description='Crear una nueva especialidad',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'nombre': openapi.Schema(type=openapi.TYPE_STRING, description='Nombre de la especialidad')
            },
            required=['nombre']
        ),
        responses={
            201: EspecialidadSerializer,
            400: 'Solicitud incorrecta'
        }
    )
    def post(self, request):
        '''
        Crear una nueva especialidad.
        '''
        especialidad = EspecialidadSerializer(data=request.data)
        if especialidad.is_valid():
            especialidad.save()
            return Response(especialidad.data, status=status.HTTP_201_CREATED)
        return Response(especialidad.errors, status=status.HTTP_400_BAD_REQUEST)