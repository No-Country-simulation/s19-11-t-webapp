from rest_framework import serializers
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
    class Meta:
        model = Paciente
        fields = ['id_usuario', 'documento', 'direccion', 'fecha_nacimiento', 'genero', 'numero_seguridad_social', 'historial_medico']

    def validate_id_usuario(self, value):
        '''
        Verifica que el usuario asociado exista.
        '''
        if not isinstance(value, Usuario):
            # Si `value` no es un objeto `Usuario`, busca el usuario por su ID
            value = Usuario.objects.filter(id=value).first()

        if not value:
            raise serializers.ValidationError('El usuario especificado no existe.')
        return value

    def create(self, validated_data):
        '''
        Crea un paciente asociándolo a un usuario existente.
        '''
        return Paciente.objects.create(**validated_data)


class MedicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medico
        fields = ['id_usuario', 'especialidad', 'nro_matricula']

    def validate_id_usuario(self, value):
        '''
        Verifica que el usuario asociado exista.
        '''
        if not isinstance(value, Usuario):
            # Si `value` no es un objeto `Usuario`, busca el usuario por su ID
            value = Usuario.objects.filter(id=value).first()

        if not value:
            raise serializers.ValidationError('El usuario especificado no existe.')
        return value

    def create(self, validated_data):
        '''
        Crea un médico asociándolo a un usuario existente.
        '''
        # En el `validated_data` debería estar el ID del usuario, y lo estamos asociando correctamente.
        return Medico.objects.create(**validated_data)