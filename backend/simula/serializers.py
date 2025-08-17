# backend/simula/serializers.py
from rest_framework import serializers
from .models import Questao, Simulado, Resposta # Verifique se Resposta está no import

class QuestaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Questao
        fields = '__all__'

# NOVO SERIALIZER PARA O MODELO RESPOSTA
class RespostaSerializer(serializers.ModelSerializer):
    # Incluímos o ID da questão para facilitar a vida do front-end
    questao_id = serializers.ReadOnlyField(source='questao.id')
    class Meta:
        model = Resposta
        fields = ['questao_id', 'resposta_usuario', 'correta']


class SimuladoSerializer(serializers.ModelSerializer):
    questoes = QuestaoSerializer(many=True, read_only=True)
    respostas = RespostaSerializer(many=True, read_only=True, source='resposta_set')

    class Meta:
        model = Simulado
        fields = ['id', 'usuario', 'questoes', 'data_criacao', 'pontuacao_final', 'respostas', 'tempo_levado']