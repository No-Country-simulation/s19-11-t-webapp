from django.urls import path
from .views import LoginView, LogoutView

urlpatterns = [
    path('auth/login/', LoginView.as_view(), name='token_obtain_pair'),
    path('auth/logout/', LogoutView.as_view(), name='token_logout'),
]
