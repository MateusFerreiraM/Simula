# backend/simula/views.py
from rest_framework import generics, views, response, status
from django.contrib.auth.models import User
import random
from .models import Questao, Simulado, Resposta
from .serializers import QuestaoSerializer, SimuladoSerializer
from itertools import chain
from rest_framework.permissions import IsAuthenticated

class QuestaoListCreateAPIView(generics.ListCreateAPIView):
    queryset = Questao.objects.all()
    serializer_class = QuestaoSerializer

class GerarEnemAPIView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        questoes_por_materia = 2
        materias = ['matematica', 'portugues', 'historia', 'geografia', 'fisica', 'quimica', 'biologia']

        questoes_selecionadas = []
        for materia in materias:
            questoes_da_materia = Questao.objects.filter(materia=materia)

            if questoes_da_materia.count() < questoes_por_materia:
                continue 

            questoes_selecionadas.extend(
                random.sample(list(questoes_da_materia), questoes_por_materia)
            )

        # ADICIONE ESTA NOVA VERIFICAÇÃO AQUI
        if not questoes_selecionadas:
            return response.Response(
                {"erro": "Não há questões suficientes no banco de dados para gerar um simulado ENEM. Verifique se há pelo menos 2 questões de cada matéria cadastradas no admin."},
                status=status.HTTP_400_BAD_REQUEST
            )

        usuario = self.request.user
        simulado = Simulado.objects.create(usuario=usuario)
        simulado.questoes.set(questoes_selecionadas)

        serializer = SimuladoSerializer(simulado)
        return response.Response(serializer.data, status=status.HTTP_201_CREATED)

class GerarSimuladoAPIView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # 1. Pega os dados enviados pelo front-end, incluindo a nova 'dificuldade'
        materias = request.data.get('materias', [])
        num_questoes = request.data.get('num_questoes', 10)
        dificuldade = request.data.get('dificuldade', None) # Novo!

        # ... (validação básica existente) ...
        if not materias or not num_questoes:
            return response.Response(...)

        # 2. Inicia a filtragem pelas matérias selecionadas
        questoes_disponiveis = Questao.objects.filter(materia__in=materias)

        # 3. Se uma dificuldade foi especificada, adiciona um filtro extra
        if dificuldade:
            questoes_disponiveis = questoes_disponiveis.filter(dificuldade=dificuldade)

        # ... (lógica existente para selecionar questões e criar o simulado) ...
        if questoes_disponiveis.count() < num_questoes:
            return response.Response(
                {"erro": "Não há questões suficientes para os filtros selecionados."},
                status=status.HTTP_400_BAD_REQUEST
            )

        questoes_selecionadas = random.sample(list(questoes_disponiveis), num_questoes)

        usuario = self.request.user
        simulado = Simulado.objects.create(usuario=usuario)
        simulado.questoes.set(questoes_selecionadas)

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
    
class MeusSimuladosListView(generics.ListAPIView):
    serializer_class = SimuladoSerializer
    # Apenas usuários autenticados podem acessar esta view
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filtra os simulados para retornar apenas os do usuário logado
        # A mágica acontece aqui: `self.request.user` é o usuário identificado
        # pelo token JWT enviado na requisição.
        return Simulado.objects.filter(usuario=self.request.user).order_by('-data_criacao')

class FinalizarSimuladoAPIView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        simulado_id = kwargs.get('pk')
        tempo_levado = request.data.get('tempo_levado')

        try:
            simulado = Simulado.objects.get(id=simulado_id, usuario=request.user)

            # Calcula a pontuação final no back-end
            respostas_corretas = Resposta.objects.filter(simulado=simulado, correta=True).count()

            # Salva o tempo e a pontuação final
            simulado.tempo_levado = tempo_levado
            simulado.pontuacao_final = respostas_corretas
            simulado.save()

            serializer = SimuladoSerializer(simulado)
            return response.Response(serializer.data, status=status.HTTP_200_OK)
        except Simulado.DoesNotExist:
            return response.Response({"erro": "Simulado não encontrado."}, status=status.HTTP_404_NOT_FOUND)
