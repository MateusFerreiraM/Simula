# backend/simula/views.py
from rest_framework import generics, views, response, status
from django.contrib.auth.models import User
import random
from .models import Questao, Simulado, Resposta
from .serializers import QuestaoSerializer, SimuladoSerializer
from itertools import chain

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

class SalvarRespostaAPIView(views.APIView):
    def post(self, request, *args, **kwargs):
        simulado_id = request.data.get('simulado_id')
        questao_id = request.data.get('questao_id')
        resposta_usuario = request.data.get('resposta_usuario')

        try:
            simulado = Simulado.objects.get(id=simulado_id)
            questao = Questao.objects.get(id=questao_id)

            # Verifica se a resposta está correta
            esta_correta = (questao.resposta_correta == resposta_usuario)

            # Cria ou atualiza a resposta no banco de dados
            Resposta.objects.update_or_create(
                simulado=simulado,
                questao=questao,
                defaults={'resposta_usuario': resposta_usuario, 'correta': esta_correta}
            )

            return response.Response({"status": "sucesso"}, status=status.HTTP_200_OK)
        except (Simulado.DoesNotExist, Questao.DoesNotExist):
            return response.Response({"erro": "Simulado ou questão não encontrados."}, status=status.HTTP_404_NOT_FOUND)
        
class GerarEnemAPIView(views.APIView):
    def post(self, request, *args, **kwargs):
        # Regras do nosso ENEM simplificado
        questoes_por_materia = 2
        materias = ['matematica', 'portugues', 'historia', 'geografia', 'fisica', 'quimica', 'biologia']

        questoes_selecionadas = []
        for materia in materias:
            # Pega todas as questões da matéria atual
            questoes_da_materia = Questao.objects.filter(materia=materia)

            # Garante que temos questões suficientes
            if questoes_da_materia.count() < questoes_por_materia:
                # Numa aplicação real, poderíamos ter um tratamento de erro melhor
                continue 

            # Seleciona um número aleatório de questões daquela matéria
            questoes_selecionadas.extend(
                random.sample(list(questoes_da_materia), questoes_por_materia)
            )

        # TODO: Substituir pelo usuário autenticado quando implementarmos o login
        usuario = User.objects.first()
        if not usuario:
            return response.Response({"erro": "Nenhum usuário encontrado."}, status=status.HTTP_400_BAD_REQUEST)

        simulado = Simulado.objects.create(usuario=usuario)
        simulado.questoes.set(questoes_selecionadas)

        serializer = SimuladoSerializer(simulado)
        return response.Response(serializer.data, status=status.HTTP_201_CREATED)