from rest_framework.views import APIView
from rest_framework.response import Response  
from rest_framework import status
from .models import Especialidad
from .serializers import EspecialidadSerializer

class EspecialidadView(APIView):
    def get(self, request, id=0):
        if id > 0:
            especialidad = Especialidad.objects.get(pk=id)
            especialidad_serializer = EspecialidadSerializer(especialidad)
            return Response(especialidad_serializer.data)
        else:
            especialidades = Especialidad.objects.all()
            especialidades_serializer = EspecialidadSerializer(especialidades, many=True)
            return Response(especialidades_serializer.data)
    
    def post(self, request):
        especialidad = EspecialidadSerializer(data=request.data)
        if especialidad.is_valid():
            especialidad.save()
            return Response(especialidad.data, status=status.HTTP_201_CREATED)
        return Response(especialidad.errors, status=status.HTTP_400_BAD_REQUEST)