import random
from rest_framework import generics, views, response, status
from rest_framework.permissions import IsAuthenticated
from .models import Questao, Simulado, Resposta
from .serializers import QuestaoSerializer, SimuladoSerializer

class QuestaoListCreateAPIView(generics.ListCreateAPIView):
    """
    Endpoint público para listar todas as questões disponíveis.
    Não requer autenticação.
    """
    queryset = Questao.objects.all()
    serializer_class = QuestaoSerializer

class GerarSimuladoAPIView(views.APIView):
    """
    Endpoint para criar um novo Simulado Personalizado para o usuário autenticado.
    Recebe uma lista de matérias, número de questões e dificuldade opcional.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        materias = request.data.get('materias', [])
        num_questoes = request.data.get('num_questoes', 10)
        dificuldade = request.data.get('dificuldade', None)

        if not materias or not num_questoes:
            return response.Response(
                {"erro": "Matérias e número de questões são obrigatórios."},
                status=status.HTTP_400_BAD_REQUEST
            )

        questoes_disponiveis = Questao.objects.filter(materia__in=materias)
        if dificuldade:
            questoes_disponiveis = questoes_disponiveis.filter(dificuldade=dificuldade)

        if questoes_disponiveis.count() < num_questoes:
            return response.Response(
                {"erro": "Não há questões suficientes para os filtros selecionados."},
                status=status.HTTP_400_BAD_REQUEST
            )

        questoes_selecionadas = random.sample(list(questoes_disponiveis), num_questoes)
        simulado = Simulado.objects.create(usuario=request.user, tipo='PERSONALIZADO')
        simulado.questoes.set(questoes_selecionadas)

        serializer = SimuladoSerializer(simulado)
        return response.Response(serializer.data, status=status.HTTP_201_CREATED)

class GerarEnemAPIView(views.APIView):
    """
    Endpoint para criar um novo Simulado estilo ENEM para o usuário autenticado.
    Usa regras pré-definidas para selecionar as questões.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        questoes_por_materia = 2
        materias = ['matematica', 'portugues', 'historia', 'geografia', 'fisica', 'quimica', 'biologia']
        questoes_selecionadas = []

        for materia in materias:
            questoes_da_materia = Questao.objects.filter(materia=materia)
            if questoes_da_materia.count() >= questoes_por_materia:
                questoes_selecionadas.extend(
                    random.sample(list(questoes_da_materia), questoes_por_materia)
                )

        if not questoes_selecionadas:
            return response.Response(
                {"erro": "Não há questões suficientes no banco de dados para gerar um simulado ENEM."},
                status=status.HTTP_400_BAD_REQUEST
            )

        simulado = Simulado.objects.create(usuario=request.user, tipo='ENEM')
        simulado.questoes.set(questoes_selecionadas)

        serializer = SimuladoSerializer(simulado)
        return response.Response(serializer.data, status=status.HTTP_201_CREATED)

class SimuladoDetailAPIView(generics.RetrieveAPIView):
    """
    Endpoint para buscar os detalhes de um simulado específico.
    Apenas o usuário dono do simulado pode acessá-lo.
    """
    serializer_class = SimuladoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Garante que um usuário só possa ver os próprios simulados
        return Simulado.objects.filter(usuario=self.request.user)

class MeusSimuladosListView(generics.ListAPIView):
    """
    Endpoint para listar todos os simulados completados pelo usuário autenticado.
    """
    serializer_class = SimuladoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Simulado.objects.filter(usuario=self.request.user).order_by('-data_criacao')

class SalvarRespostaAPIView(views.APIView):
    """
    Endpoint para salvar a resposta de um usuário para uma questão de um simulado.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        simulado_id = request.data.get('simulado_id')
        questao_id = request.data.get('questao_id')
        resposta_usuario = request.data.get('resposta_usuario')

        try:
            # Garante que o usuário só possa modificar seu próprio simulado
            simulado = Simulado.objects.get(id=simulado_id, usuario=request.user)
            questao = Questao.objects.get(id=questao_id)

            esta_correta = (questao.resposta_correta == resposta_usuario)

            Resposta.objects.update_or_create(
                simulado=simulado,
                questao=questao,
                defaults={'resposta_usuario': resposta_usuario, 'correta': esta_correta}
            )
            return response.Response({"status": "sucesso"}, status=status.HTTP_200_OK)
        except (Simulado.DoesNotExist, Questao.DoesNotExist):
            return response.Response({"erro": "Simulado ou questão não encontrados."}, status=status.HTTP_404_NOT_FOUND)

class FinalizarSimuladoAPIView(views.APIView):
    """
    Endpoint para marcar um simulado como finalizado, salvando o tempo
    gasto e a pontuação final.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        simulado_id = kwargs.get('pk')
        tempo_levado = request.data.get('tempo_levado')

        try:
            simulado = Simulado.objects.get(id=simulado_id, usuario=request.user)
            respostas_corretas = Resposta.objects.filter(simulado=simulado, correta=True).count()
            
            simulado.tempo_levado = tempo_levado
            simulado.pontuacao_final = respostas_corretas
            simulado.save()

            serializer = SimuladoSerializer(simulado)
            return response.Response(serializer.data, status=status.HTTP_200_OK)
        except Simulado.DoesNotExist:
            return response.Response({"erro": "Simulado não encontrado."}, status=status.HTTP_404_NOT_FOUND)