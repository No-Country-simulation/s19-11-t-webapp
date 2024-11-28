from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.conf import settings
from .serializers import CustomTokenObtainPairSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Verificamos que el usuario está activo
            user = serializer.validated_data

            # Procesamos el token de la misma manera
            response = super().post(request, *args, **kwargs)

            print('response.data:', response.data)

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

            # Incluimos el campo `user_type` en la respuesta
            response.data['user_type'] = serializer.validated_data['user_type']

            return response
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')
        
        if not refresh_token:
            return Response({'error': 'Refresh token not provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        request.data['refresh'] = refresh_token
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            access_token = response.data.get('access')
            if access_token:
                response.set_cookie(
                    key='access_token',
                    value=access_token,
                    max_age=settings.AUTH_COOKIE_ACCESS_MAX_AGE,
                    secure=settings.AUTH_COOKIE_SECURE,
                    httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                    samesite=settings.AUTH_COOKIE_SAMESITE,
                    path=settings.AUTH_COOKIE_PATH,
                )
        return response


class LogoutView(APIView):
    def post(self, request, *args, **kwargs):
        # Obtener el refresh_token de las cookies
        refresh_token = request.COOKIES.get('refresh_token')
        
        if not refresh_token:
            return Response({'error': 'Refresh token not provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Blacklist del token
            token = RefreshToken(refresh_token)
            token.blacklist()

            # Eliminar cookies del cliente
            response = Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
            response.delete_cookie('refresh_token')
            response.delete_cookie('access_token')  # Si estás usando un access_token en cookies también
            return response
        except Exception as e:
            # Si ocurre un error al procesar el token
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)