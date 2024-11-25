from rest_framework import serializers
from especialidad.models import Especialidad
from .models import Usuario, Paciente, Medico


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['email', 'password', 'first_name', 'last_name', 'telefono']
        extra_kwargs = {
            'password': {'write_only': True},  # La contraseña no se incluye en las respuestas
        }

    def create(self, validated_data):
        '''
        Crea un usuario usando el manager y hashea su contraseña.
        '''
        return Usuario.objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        '''
        Actualiza un usuario, incluyendo el cambio de contraseña si se proporciona.
        '''
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
    

class PacienteSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer()

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
        usuario_data = validated_data.pop('usuario')

        # Validar y crear usuario
        usuario_serializer = UsuarioSerializer(data=usuario_data)
        if not usuario_serializer.is_valid():
            raise serializers.ValidationError(usuario_serializer.errors)

        usuario = usuario_serializer.save()

        # Crear paciente
        paciente = Paciente.objects.create(id_usuario=usuario, **validated_data)
        return paciente
    
from rest_framework import serializers
from .models import Medico, Usuario, Especialidad

class MedicoSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer()

    class Meta:
        model = Medico
        fields = ['usuario', 'especialidad', 'nro_matricula']

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
