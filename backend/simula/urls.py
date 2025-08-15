# backend/simula/urls.py
from django.urls import path
from .views import QuestaoListCreateAPIView, GerarSimuladoAPIView, SimuladoDetailAPIView

urlpatterns = [
    path('questoes/', QuestaoListCreateAPIView.as_view(), name='lista-questoes'),
    path('gerar-simulado/', GerarSimuladoAPIView.as_view(), name='gerar-simulado'),
    path('simulados/<int:pk>/', SimuladoDetailAPIView.as_view(), name='detalhe-simulado'),
]