from django import forms
from django.contrib.auth import authenticate

class CustomAuthenticationForm(forms.Form):
    email = forms.EmailField()
    password = forms.CharField(widget=forms.PasswordInput)

    def clean(self):
        email = self.cleaned_data.get('email')
        password = self.cleaned_data.get('password')

        if email and password:
            self.user = authenticate(username=email, password=password)
            if self.user is None:
                raise forms.ValidationError('Correo electrónico o contraseña incorrectos.')
        return self.cleaned_data

    def get_user(self):
        return self.user