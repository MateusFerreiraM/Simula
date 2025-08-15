# backend/simula/admin.py
from django.contrib import admin
from .models import Questao # Importa nosso modelo Questao

# "Registre" o modelo Questao no site de administração.
# A partir de agora, o Django saberá que deve exibir uma interface
# para adicionar, editar e apagar Questões.
admin.site.register(Questao)