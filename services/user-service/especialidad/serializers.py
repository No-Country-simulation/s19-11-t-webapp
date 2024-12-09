from rest_framework import serializers
from .models import Especialidad

class EspecialidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Especialidad
        fields = '__all__'

    def validate(self, data):
        if Especialidad.objects.filter(nombre=data['nombre']).exists():
            raise serializers.ValidationError('Ya existe una especialidad con ese nombre')
        return data
    
    def create(self, validated_data):
        especialidad = Especialidad.objects.create(**validated_data)
        return especialidad
    
    def update(self, instance, validated_data):
        instance.nombre = validated_data.get('nombre', instance.nombre)
        instance.save()
        return instance
    