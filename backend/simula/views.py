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
    Recebe uma lista de matérias, número de questões, dificuldade opcional e
    o novo 'modo_numero_questoes' para determinar a lógica de seleção.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        materias = request.data.get('materias', [])
        num_questoes = request.data.get('num_questoes', 10)
        dificuldade = request.data.get('dificuldade', None)
        modo_numero_questoes = request.data.get('modo_numero_questoes', 'total')

        if not materias or not num_questoes or num_questoes <= 0:
            return response.Response(
                {"erro": "Matérias e um número de questões válido são obrigatórios."},
                status=status.HTTP_400_BAD_REQUEST
            )

        questoes_selecionadas = []
        
        if modo_numero_questoes == 'por_materia':
            for materia in materias:
                questoes_da_materia = Questao.objects.filter(materia=materia)
                if dificuldade:
                    questoes_da_materia = questoes_da_materia.filter(dificuldade=dificuldade)

                if questoes_da_materia.count() < num_questoes:
                    return response.Response(
                        {"erro": f"Não há {num_questoes} questões de '{materia}' com os filtros selecionados."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                questoes_selecionadas.extend(random.sample(list(questoes_da_materia), num_questoes))

        else:
            num_materias = len(materias)
            base_por_materia = num_questoes // num_materias
            extras = num_questoes % num_materias

            questoes_disponiveis = Questao.objects.filter(materia__in=materias)
            if dificuldade:
                questoes_disponiveis = questoes_disponiveis.filter(dificuldade=dificuldade)
            
            if questoes_disponiveis.count() < num_questoes:
                return response.Response(
                    {"erro": "Não há questões suficientes no total para os filtros selecionados."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            ids_ja_usados = set()

            if base_por_materia > 0:
                for materia in materias:
                    questoes_da_materia = Questao.objects.filter(materia=materia)
                    if dificuldade:
                        questoes_da_materia = questoes_da_materia.filter(dificuldade=dificuldade)
                    
                    if questoes_da_materia.count() < base_por_materia:
                         return response.Response(
                            {"erro": f"Não há questões suficientes de '{materia}' para uma distribuição equilibrada."},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    
                    selecao = random.sample(list(questoes_da_materia), base_por_materia)
                    questoes_selecionadas.extend(selecao)
                    for q in selecao:
                        ids_ja_usados.add(q.id)
            
            if extras > 0:
                questoes_restantes = questoes_disponiveis.exclude(id__in=ids_ja_usados)
                questoes_selecionadas.extend(random.sample(list(questoes_restantes), extras))

        if not questoes_selecionadas:
             return response.Response(
                {"erro": "Não foi possível selecionar nenhuma questão com os critérios fornecidos."},
                status=status.HTTP_400_BAD_REQUEST
            )

        simulado = Simulado.objects.create(usuario=request.user, tipo='PERSONALIZADO')
        simulado.questoes.set(questoes_selecionadas)

        serializer = SimuladoSerializer(simulado)
        return response.Response(serializer.data, status=status.HTTP_201_CREATED)

class GerarEnemAPIView(views.APIView):
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
    serializer_class = SimuladoSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Simulado.objects.filter(usuario=self.request.user)

class MeusSimuladosListView(generics.ListAPIView):
    serializer_class = SimuladoSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Simulado.objects.filter(usuario=self.request.user).order_by('-data_criacao')

class SalvarRespostaAPIView(views.APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        simulado_id = request.data.get('simulado_id')
        questao_id = request.data.get('questao_id')
        resposta_usuario = request.data.get('resposta_usuario')

        try:
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