from django.contrib.auth import login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from .serializers import CustomUserSerializer
from .forms import CustomAuthenticationForm
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
import json

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(View):
    @swagger_auto_schema(
        operation_description='Iniciar sesión con correo electrónico y contraseña',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'email': openapi.Schema(type=openapi.TYPE_STRING, description='Correo electrónico'),
                'password': openapi.Schema(type=openapi.TYPE_STRING, description='Contraseña'),
            },
            required=['email', 'password']
        ),
        responses={
            200: openapi.Response(description='Inicio de sesión exitoso'),
            400: openapi.Response(description='Solicitud incorrecta')
        }
    )
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'errors': 'Invalid JSON'}, status=400)

        form = CustomAuthenticationForm(data)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            user_serializer = CustomUserSerializer(user)
            response = JsonResponse({'message': 'Inicio de sesión exitoso', 'user': user_serializer.data}, status=200)
            response.set_cookie('sessionid', request.session.session_key, httponly=True, secure=True, samesite='Lax')
            response.set_cookie('csrftoken', request.META.get('CSRF_COOKIE'), httponly=False, secure=True, samesite='Lax')
            return response
        return JsonResponse({'errors': form.errors}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(View):
    @swagger_auto_schema(
        operation_description='Cerrar sesión del usuario',
        responses={
            200: openapi.Response(description='Cierre de sesión exitoso'),
            400: openapi.Response(description='Solicitud incorrecta')
        }
    )
    def post(self, request, *args, **kwargs):
        logout(request)
        response = JsonResponse({'message': 'Cierre de sesión exitoso'}, status=200)
        response.delete_cookie('sessionid')
        response.delete_cookie('csrftoken')
        return response