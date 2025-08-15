# backend/simula/urls.py
from django.urls import path
from .views import QuestaoListCreateAPIView, GerarSimuladoAPIView, SimuladoDetailAPIView, SalvarRespostaAPIView, GerarEnemAPIView, MeusSimuladosListView

urlpatterns = [
    path('questoes/', QuestaoListCreateAPIView.as_view(), name='lista-questoes'),
    path('gerar-simulado/', GerarSimuladoAPIView.as_view(), name='gerar-simulado'),
    path('simulados/<int:pk>/', SimuladoDetailAPIView.as_view(), name='detalhe-simulado'),
    path('salvar-resposta/', SalvarRespostaAPIView.as_view(), name='salvar-resposta'),
    path('gerar-enem/', GerarEnemAPIView.as_view(), name='gerar-enem'),
    path('meus-simulados/', MeusSimuladosListView.as_view(), name='meus-simulados'),
]