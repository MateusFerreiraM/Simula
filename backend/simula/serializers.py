# backend/simula/serializers.py
from rest_framework import serializers
from .models import Questao
from .models import Questao, Simulado

class QuestaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Questao
        fields = '__all__' # Isso diz ao serializer para incluir todos os campos do modelo Questao

class SimuladoSerializer(serializers.ModelSerializer):
    # Usamos o QuestaoSerializer aqui para garantir que as questões
    # dentro do simulado sejam formatadas corretamente.
    # 'many=True' indica que é uma lista de questões.
    questoes = QuestaoSerializer(many=True, read_only=True)

    class Meta:
        model = Simulado
        # Incluímos todos os campos do modelo Simulado
        fields = '__all__'