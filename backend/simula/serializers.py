from rest_framework import serializers
from .models import Questao, Simulado, Resposta

class QuestaoSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo Questao. Converte objetos Questao para JSON,
    incluindo todos os campos relevantes para o front-end.
    """
    class Meta:
        model = Questao
        fields = [
            'id',
            'materia',
            'dificuldade',
            'texto',
            'alternativa_a',
            'alternativa_b',
            'alternativa_c',
            'alternativa_d',
            'alternativa_e',
            'resposta_correta',
        ]

class RespostaSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo Resposta. Usado de forma aninhada no SimuladoSerializer
    para mostrar as respostas de um usuário em um determinado simulado.
    """
    questao_id = serializers.ReadOnlyField(source='questao.id')

    class Meta:
        model = Resposta
        fields = ['questao_id', 'resposta_usuario', 'correta']

class SimuladoSerializer(serializers.ModelSerializer):
    """
    Serializer principal para o modelo Simulado. Inclui dados aninhados das
    questões e das respostas associadas para fornecer uma visão completa do simulado.
    """
    questoes = QuestaoSerializer(many=True, read_only=True)
    respostas = RespostaSerializer(many=True, read_only=True, source='resposta_set')

    class Meta:
        model = Simulado
        fields = [
            'id',
            'usuario',
            'questoes',
            'data_criacao',
            'pontuacao_final',
            'respostas',
            'tempo_levado',
            'tipo',
        ]   