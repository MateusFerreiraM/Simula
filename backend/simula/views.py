# backend/simula/views.py
from rest_framework import generics, views, response, status
from django.contrib.auth.models import User
import random
from .models import Questao, Simulado
from .serializers import QuestaoSerializer, SimuladoSerializer

class QuestaoListCreateAPIView(generics.ListCreateAPIView):
    queryset = Questao.objects.all()
    serializer_class = QuestaoSerializer

class GerarSimuladoAPIView(views.APIView):
    def post(self, request, *args, **kwargs):
        # 1. Pega os dados enviados pelo front-end
        materias = request.data.get('materias', [])
        num_questoes = request.data.get('num_questoes', 10)

        # Validação básica
        if not materias or not num_questoes:
            return response.Response(
                {"erro": "Matérias e número de questões são obrigatórios."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2. Filtra as questões no banco de dados com base nas matérias
        questoes_disponiveis = Questao.objects.filter(materia__in=materias)

        # 3. Seleciona um número aleatório de questões
        if questoes_disponiveis.count() < num_questoes:
            return response.Response(
                {"erro": "Não há questões suficientes para os filtros selecionados."},
                status=status.HTTP_400_BAD_REQUEST
            )

        questoes_selecionadas = random.sample(list(questoes_disponiveis), num_questoes)

        # 4. Cria a instância do Simulado no banco de dados
        # TODO: Substituir pelo usuário autenticado quando implementarmos o login
        usuario = User.objects.first() 
        if not usuario:
            return response.Response({"erro": "Nenhum usuário encontrado para associar ao simulado."}, status=status.HTTP_400_BAD_REQUEST)

        simulado = Simulado.objects.create(usuario=usuario)
        simulado.questoes.set(questoes_selecionadas)

        # 5. Converte o objeto do simulado criado para JSON e o retorna
        serializer = SimuladoSerializer(simulado)
        return response.Response(serializer.data, status=status.HTTP_201_CREATED)
    
class SimuladoDetailAPIView(generics.RetrieveAPIView):
    queryset = Simulado.objects.all()
    serializer_class = SimuladoSerializer
    # 'lookup_field' não é estritamente necessário se o parâmetro na URL for 'pk',
    # mas é uma boa prática ser explícito.