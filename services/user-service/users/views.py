from django.db import transaction
from rest_framework.permissions import AllowAny, IsAuthenticated
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
    permission_classes = [AllowAny]
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

        # Usar el PacienteSerializer directamente
        serializer = PacienteSerializer(data=data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Guardar el paciente (esto también crea el usuario anidado)
        serializer.save()

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
