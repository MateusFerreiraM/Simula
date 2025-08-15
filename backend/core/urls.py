# backend/core/urls.py  <-- O Porteiro
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # Esta é a regra do porteiro.
    # Qualquer endereço que comece com 'api/' deve ser enviado para o nosso app 'simula'.
    path('api/', include('simula.urls')),
]