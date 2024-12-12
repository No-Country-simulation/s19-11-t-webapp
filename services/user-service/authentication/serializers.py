from users.models import Usuario, Paciente, Medico
from rest_framework import serializers

class CustomUserSerializer(serializers.ModelSerializer):
    user_type = serializers.SerializerMethodField()
    user_id = serializers.SerializerMethodField()

    class Meta:
        model = Usuario
        fields = ['id', 'email', 'first_name', 'last_name', 'user_type', 'user_id']

    def get_user_type(self, obj):
        if obj.is_staff:
            return 'Administrador'
        if Paciente.objects.filter(id_usuario=obj).exists():
            return 'Paciente'
        if Medico.objects.filter(id_usuario=obj).exists():
            return 'Medico'
        return 'Usuario'

    def get_user_id(self, obj):
        if obj.is_staff:
            return None
        paciente = Paciente.objects.filter(id_usuario=obj).first()
        if paciente:
            return paciente.id_paciente
        medico = Medico.objects.filter(id_usuario=obj).first()
        if medico:
            return medico.id_medico
        return None