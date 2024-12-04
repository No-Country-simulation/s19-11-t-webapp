from django.urls import path
from .views import CustomTokenObtainPairView, CustomTokenRefreshView, LogoutView, VerifyTokenView

urlpatterns = [
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('auth/logout/', LogoutView.as_view(), name='token_logout'),
    path('auth/verify/', VerifyTokenView.as_view(), name='token_verify'),
]
