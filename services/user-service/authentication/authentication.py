from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.request import Request

class CustomAuthentication(JWTAuthentication):
    def authenticate(self, request: Request):
        # Intentar obtener el token desde las cookies si no está en el encabezado
        header = self.get_header(request)
        if header is None:
            raw_token = request.COOKIES.get('access_token')
        else:
            raw_token = self.get_raw_token(header)

        if raw_token is None:
            return None

        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token