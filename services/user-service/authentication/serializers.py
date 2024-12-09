from users.models import Usuario, Paciente, Medico
from rest_framework import serializers

class CustomUserSerializer(serializers.ModelSerializer):
    user_type = serializers.SerializerMethodField()

    class Meta:
        model = Usuario
        fields = ['email', 'first_name', 'last_name', 'user_type']

    def get_user_type(self, obj):
        if obj.is_staff:
            return 'Administrador'
        if Paciente.objects.filter(id_usuario=obj).exists():
            return 'Paciente'
        if Medico.objects.filter(id_usuario=obj).exists():
            return 'Medico'
        return 'Usuario'