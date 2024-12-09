from rest_framework import serializers
from especialidad.models import Especialidad
from .models import Usuario, Paciente, Medico


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['email', 'first_name', 'last_name']


class PacienteSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(source='id_usuario')

    class Meta:
        model = Paciente
        fields = ['usuario', 'documento', 'direccion', 'fecha_nacimiento', 'genero', 'historial_medico']

    def validate(self, attrs):
        if not attrs.get('documento'):
            raise serializers.ValidationError('El documento es requerido.')
        if not attrs.get('direccion'):
            raise serializers.ValidationError('La dirección es requerida.')
        if not attrs.get('fecha_nacimiento'):
            raise serializers.ValidationError('La fecha de nacimiento es requerida.')
        if not attrs.get('genero'):
            raise serializers.ValidationError('El género es requerido.')
        return attrs  # Devuelve los datos validados

    def create(self, validated_data):
        # Extraer datos de usuario
        usuario_data = validated_data.pop('id_usuario')

        # Validar y crear usuario
        usuario_serializer = UsuarioSerializer(data=usuario_data)
        if not usuario_serializer.is_valid():
            raise serializers.ValidationError(usuario_serializer.errors)

        usuario = usuario_serializer.save()

        # Crear paciente
        paciente = Paciente.objects.create(id_usuario=usuario, **validated_data)
        return paciente

    def update(self, instance, validated_data):
        usuario_data = validated_data.pop('id_usuario')
        usuario = instance.id_usuario

        instance.documento = validated_data.get('documento', instance.documento)
        instance.direccion = validated_data.get('direccion', instance.direccion)
        instance.fecha_nacimiento = validated_data.get('fecha_nacimiento', instance.fecha_nacimiento)
        instance.genero = validated_data.get('genero', instance.genero)
        instance.numero_seguridad_social = validated_data.get('numero_seguridad_social', instance.numero_seguridad_social)
        instance.historial_medico = validated_data.get('historial_medico', instance.historial_medico)
        instance.save()

        usuario.email = usuario_data.get('email', usuario.email)
        usuario.first_name = usuario_data.get('first_name', usuario.first_name)
        usuario.last_name = usuario_data.get('last_name', usuario.last_name)
        usuario.telefono = usuario_data.get('telefono', usuario.telefono)
        usuario.save()

        return instance


class MedicoSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(source='id_usuario')

    class Meta:
        model = Medico
        fields = ['usuario', 'especialidad', 'nro_matricula']
        partial = True

    def validate(self, attrs):
        # Validar que la especialidad exista
        especialidad = attrs.get('especialidad')
        if not Especialidad.objects.filter(id_especialidad=especialidad.id_especialidad).exists():
            raise serializers.ValidationError({'especialidad': 'La especialidad no existe.'})
        
        # Validar que el número de matrícula esté presente
        if not attrs.get('nro_matricula'):
            raise serializers.ValidationError({'nro_matricula': 'El número de matrícula es requerido.'})
        
        return attrs

    def create(self, validated_data):
        # Extraer y validar datos de usuario
        usuario_data = validated_data.pop('usuario')
        usuario_serializer = UsuarioSerializer(data=usuario_data)
        if not usuario_serializer.is_valid():
            raise serializers.ValidationError({'usuario': usuario_serializer.errors})

        usuario = usuario_serializer.save()

        # Crear el objeto médico
        medico = Medico.objects.create(id_usuario=usuario, **validated_data)
        return medico
