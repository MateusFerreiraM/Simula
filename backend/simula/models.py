# backend/simula/models.py
from django.db import models
from django.contrib.auth.models import User

# Definimos as opções fixas para os campos de matéria e dificuldade
# Isso ajuda a manter a consistência dos dados
MATERIA_CHOICES = [
    ('matematica', 'Matemática'),
    ('portugues', 'Português'),
    ('historia', 'História'),
    ('geografia', 'Geografia'),
    ('fisica', 'Física'),
    ('quimica', 'Química'),
    ('biologia', 'Biologia'),
]

DIFICULDADE_CHOICES = [
    ('F', 'Fácil'),
    ('M', 'Médio'),
    ('D', 'Difícil'),
]

RESPOSTA_CHOICES = [
    ('A', 'Alternativa A'),
    ('B', 'Alternativa B'),
    ('C', 'Alternativa C'),
    ('D', 'Alternativa D'),
    ('E', 'Alternativa E'),
]

# Esta classe é a representação da nossa tabela de questões no banco de dados
class Questao(models.Model):
    # Campo para a matéria da questão, com opções pré-definidas
    materia = models.CharField(max_length=20, choices=MATERIA_CHOICES)

    # Campo para a dificuldade, também com opções
    dificuldade = models.CharField(max_length=1, choices=DIFICULDADE_CHOICES)

    # O enunciado da questão, um campo de texto longo
    texto = models.TextField()

    # Campos para cada uma das 5 alternativas
    alternativa_a = models.CharField(max_length=255)
    alternativa_b = models.CharField(max_length=255)
    alternativa_c = models.CharField(max_length=255)
    alternativa_d = models.CharField(max_length=255)
    alternativa_e = models.CharField(max_length=255)

    # Campo para armazenar qual das alternativas é a correta
    resposta_correta = models.CharField(max_length=1, choices=RESPOSTA_CHOICES)

    imagem = models.ImageField(upload_to='questoes_imagens/', null=True, blank=True)    

    # Esta função define como um objeto 'Questao' será exibido (por exemplo, no painel admin)
    def __str__(self):
        return f"{self.get_materia_display()} - {self.id}"
    

# Este Model representa uma instância de uma prova realizada por um usuário.
class Simulado(models.Model):
    TIPO_SIMULADO_CHOICES = [
        ('PERSONALIZADO', 'Personalizado'),
        ('ENEM', 'ENEM'),
    ]
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    questoes = models.ManyToManyField(Questao)
    data_criacao = models.DateTimeField(auto_now_add=True)
    pontuacao_final = models.IntegerField(null=True, blank=True)
    tempo_levado = models.IntegerField(null=True, blank=True, help_text="Duração do simulado em segundos")
    tipo = models.CharField(max_length=15, choices=TIPO_SIMULADO_CHOICES, default='PERSONALIZADO')

    def __str__(self):
        return f"Simulado de {self.usuario.username} - {self.id}"


# Este Model representa a resposta de um usuário a uma questão específica dentro de um simulado.
class Resposta(models.Model):
    # Links para o simulado e a questão aos quais esta resposta pertence.
    simulado = models.ForeignKey(Simulado, on_delete=models.CASCADE)
    questao = models.ForeignKey(Questao, on_delete=models.CASCADE)

    # A alternativa que o usuário escolheu.
    resposta_usuario = models.CharField(max_length=1, choices=RESPOSTA_CHOICES)

    # Um campo para verificar rapidamente se a resposta foi correta.
    correta = models.BooleanField(default=False)

    def __str__(self):
        return f"Resposta de {self.simulado.usuario.username} para a questão {self.questao.id} no simulado {self.simulado.id}"
