from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.conf import settings
from .serializers import CustomTokenObtainPairSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


class CustomTokenObtainPairView(TokenObtainPairView):
    '''
    post:
    Obtener un nuevo par de tokens de acceso y actualización.
    '''
    serializer_class = CustomTokenObtainPairSerializer

    @swagger_auto_schema(
        operation_description='Obtener un nuevo par de tokens de acceso y actualización',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING, description='Nombre de usuario'),
                'password': openapi.Schema(type=openapi.TYPE_STRING, description='Contraseña'),
            },
            required=['username', 'password']
        ),
        responses={
            200: openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'refresh': openapi.Schema(type=openapi.TYPE_STRING, description='Token de actualización'),
                    'access': openapi.Schema(type=openapi.TYPE_STRING, description='Token de acceso'),
                }
            ),
            400: 'Solicitud incorrecta',
            401: 'No autorizado'
        }
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Verificamos que el usuario está activo
            user = serializer.validated_data

            # Procesamos el token de la misma manera
            response = super().post(request, *args, **kwargs)

            # Verificamos que el 'access' token esté presente en la respuesta
            if 'access' not in response.data:
                return Response({'error': 'Access token not generated'}, status=status.HTTP_400_BAD_REQUEST)

            # Establecemos las cookies para access y refresh tokens
            response.set_cookie(
                key='access_token',
                value=response.data['access'],
                max_age=settings.AUTH_COOKIE_ACCESS_MAX_AGE,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE,
                path=settings.AUTH_COOKIE_PATH
            )

            response.set_cookie(
                key='refresh_token',
                value=response.data['refresh'],
                max_age=settings.AUTH_COOKIE_REFRESH_MAX_AGE,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE,
                path=settings.AUTH_COOKIE_PATH
            )

            # Se eliminan los tokens de la respuesta
            del response.data['refresh']
            del response.data['access']

            return response
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenRefreshView(TokenRefreshView):
    '''
    post:
    Refrescar el token de acceso usando el token de actualización.
    '''
    @swagger_auto_schema(
        operation_description='Refrescar el token de acceso usando el token de actualización',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'refresh': openapi.Schema(type=openapi.TYPE_STRING, description='Token de actualización'),
            },
            required=['refresh']
        ),
        responses={
            200: openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'access': openapi.Schema(type=openapi.TYPE_STRING, description='Token de acceso'),
                }
            ),
            400: 'Solicitud incorrecta',
            401: 'No autorizado'
        }
    )
    def post(self, request, *args, **kwargs):
        # Obtener el refresh token desde las cookies
        refresh_token = request.COOKIES.get('refresh_token')
        
        if not refresh_token:
            return Response({'error': 'Refresh token not provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Incluir el refresh token en los datos de la solicitud
        request.data['refresh'] = refresh_token

        # Llamar al super para realizar la renovación del access token
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            # Obtener el nuevo access token y refresh token de la respuesta
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')  # Aquí obtenemos el nuevo refresh token
            if access_token and refresh_token:
                # Establecer el nuevo access token en las cookies
                response.set_cookie(
                    key='access_token',
                    value=access_token,
                    max_age=settings.AUTH_COOKIE_ACCESS_MAX_AGE,
                    secure=settings.AUTH_COOKIE_SECURE,
                    httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                    samesite=settings.AUTH_COOKIE_SAMESITE,
                    path=settings.AUTH_COOKIE_PATH,
                )
                # Establecer el nuevo refresh token en las cookies
                response.set_cookie(
                    key='refresh_token',
                    value=refresh_token,
                    max_age=settings.AUTH_COOKIE_REFRESH_MAX_AGE,  # Asegúrate de que tengas esta configuración
                    secure=settings.AUTH_COOKIE_SECURE,
                    httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                    samesite=settings.AUTH_COOKIE_SAMESITE,
                    path=settings.AUTH_COOKIE_PATH,
                )

        # Limpiar los datos no necesarios para la respuesta
        del response.data['refresh']  # Eliminar el refresh token del cuerpo de la respuesta
        del response.data['access']  # Eliminar el access token del cuerpo de la respuesta

        # Agregar un mensaje personalizado de éxito
        response.data = {'message': 'Access Token and Refresh Token successfully refreshed'}
        
        return response


class LogoutView(APIView):
    '''
    post:
    Cerrar sesión del usuario invalidando el token de actualización.
    '''
    @swagger_auto_schema(
        operation_description='Cerrar sesión del usuario invalidando el token de actualización',
        responses={
            200: openapi.Response(description='Cierre de sesión exitoso'),
            400: openapi.Response(description='Solicitud incorrecta')
        }
    )
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')
        
        if not refresh_token:
            return Response({'error': 'Refresh token not provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()  # Marca el token como inválido
            return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class VerifyTokenView(APIView):
    '''
    post:
    Verificar la validez de un token dado.
    '''
    @swagger_auto_schema(
        operation_description='Verificar la validez de un token dado',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'token': openapi.Schema(type=openapi.TYPE_STRING, description='Token a verificar'),
            },
            required=['token']
        ),
        responses={
            200: openapi.Response(
                description='Token válido',
                examples={
                    'application/json': {
                        'message': 'Token válido',
                        'user_id': 1,
                    }
                }
            ),
            400: openapi.Response(description='Solicitud incorrecta'),
            401: openapi.Response(description='No autorizado')
        }
    )
    def post(self, request, *args, **kwargs):
        token = request.data.get('token')  # O usa request.headers.get('Authorization') si lo envías en el header
        
        if not token:
            return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Quitar el prefijo 'Bearer ' si está presente
        if token.startswith('Bearer '):
            token = token.split(' ')[1]

        try:
            # Decodificar el token para validarlo
            decoded_token = AccessToken(token)
            user_id = decoded_token['user_id'] # Asume que tienes este campo en tu token

            return Response({
                'message': 'Token is valid',
                'user_id': user_id,
            }, status=status.HTTP_200_OK)
        except TokenError as e:
            return Response({'error': 'Token is invalid or expired'}, status=status.HTTP_401_UNAUTHORIZED)