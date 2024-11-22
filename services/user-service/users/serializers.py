from rest_framework import serializers
from .models import Usuario, Paciente, Medico

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'
        exclude = ['contraseña']

class PacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paciente
        fields = ['id_usuario', 'documento', 'direccion', 'fecha_nacimiento', 'genero', 'numero_seguridad_social', 'historial_medico']

    def validate(self, attrs):
        if 'id_usuario' not in attrs:
            raise serializers.ValidationError('id_usuario is required')
        if 'documento' not in attrs:
            raise serializers.ValidationError('documento is required')
        if 'direccion' not in attrs:
            raise serializers.ValidationError('direccion is required')
        if 'fecha_nacimiento' not in attrs:
            raise serializers.ValidationError('fecha_nacimiento is required')
        if 'genero' not in attrs:
            raise serializers.ValidationError('genero is required')
        if 'numero_seguridad_social' not in attrs:
            raise serializers.ValidationError('numero_seguridad_social is required')
        return super().validate(attrs)
    
    def create(self, validated_data):
        id_usuario = validated_data.pop('id_usuario')
        usuario = Usuario.objects.get(id_usuario=id_usuario)
        return Paciente.objects.create(id_usuario=usuario, **validated_data)
    
    def update(self, instance, validated_data):
        return super().update(instance, validated_data)
    
class MedicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medico
        fields = '__all__'

    def validate(self, attrs):
        if 'id_usuario' not in attrs:
            raise serializers.ValidationError('id_usuario is required')
        if 'especialidad' not in attrs:
            raise serializers.ValidationError('especialidad is required')
        if 'nro_matricula' not in attrs:
            raise serializers.ValidationError('nro_matricula is required')
        return super().validate(attrs)
    
    def create(self, validated_data):
        id_usuario = validated_data.pop('id_usuario')
        usuario = Usuario.objects.get(id_usuario=id_usuario)
        return Paciente.objects.create(id_usuario=usuario, **validated_data)
    
    def update(self, instance, validated_data):
        return super().update(instance, validated_data)