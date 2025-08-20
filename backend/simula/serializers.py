from rest_framework import serializers
from .models import Questao, Simulado, Resposta

class QuestaoPublicaSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo Questao que NÃO inclui a resposta correta.
    Usado para exibir questões para o usuário durante um simulado.
    """
    class Meta:
        model = Questao
        fields = [
            'id', 'materia', 'dificuldade', 'texto',
            'alternativa_a', 'alternativa_b', 'alternativa_c', 'alternativa_d', 'alternativa_e',
        ]

class RespostaSerializer(serializers.ModelSerializer):
    questao_id = serializers.ReadOnlyField(source='questao.id')
    class Meta:
        model = Resposta
        fields = ['questao_id', 'resposta_usuario', 'correta']

class SimuladoSerializer(serializers.ModelSerializer):
    """
    Serializer principal para o modelo Simulado.
    """
    questoes = QuestaoPublicaSerializer(many=True, read_only=True)
    respostas = RespostaSerializer(many=True, read_only=True, source='resposta_set')

    class Meta:
        model = Simulado
        fields = [
            'id', 'usuario', 'questoes', 'data_criacao',
            'pontuacao_final', 'respostas', 'tempo_levado', 'tipo',
        ]