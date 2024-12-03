from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from users.models import Usuario, Paciente, Medico
from rest_framework import serializers


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    class Meta:
         model = Usuario
         # Solo los campos que deseas exponer
         fields = ['email', 'name', 'last_name', 'user_type']

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

         # Intentamos autenticar al usuario
        user = authenticate(request=self.context.get('request'), username=email, password=password)

        if user is None:
           raise serializers.ValidationError('Invalid credentials')
        
        if not user.is_active:
            raise serializers.ValidationError('Account is inactive')

        # Determinar el tipo de usuario, si es Paciente, Medico o Administrador
        if user.is_staff:
            user_type = 'Administrador'

        if Paciente.objects.filter(id_usuario=user).exists():
             user_type = 'Paciente'

        if Medico.objects.filter(id_usuario=user).exists():
            user_type = 'Medico'

        attrs['user'] = user

        # Generar el token         
        data = super().validate(attrs)

        # Incluir información adicional en la respuesta
        data['user'] = {
                'name': user.first_name,
                'last_name': user.last_name,
                'user_type': user_type
            }

        return data
