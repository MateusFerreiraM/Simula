from django.db import models
from django.contrib.auth.models import User

# --- Constantes de Opções (Choices) ---

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


# --- Modelos da Aplicação ---

class Questao(models.Model):
    """
    Representa uma única questão de múltipla escolha no banco de dados.
    """
    materia = models.CharField(max_length=20, choices=MATERIA_CHOICES)
    dificuldade = models.CharField(max_length=1, choices=DIFICULDADE_CHOICES)
    texto = models.TextField()
    alternativa_a = models.CharField(max_length=255)
    alternativa_b = models.CharField(max_length=255)
    alternativa_c = models.CharField(max_length=255)
    alternativa_d = models.CharField(max_length=255)
    alternativa_e = models.CharField(max_length=255)
    resposta_correta = models.CharField(max_length=1, choices=RESPOSTA_CHOICES)
    imagem = models.ImageField(upload_to='questoes_imagens/', null=True, blank=True)

    def __str__(self):
        return f"{self.get_materia_display()} - Questão #{self.id}"


class Simulado(models.Model):
    """
    Representa uma instância de uma prova realizada por um usuário, contendo
    um conjunto de questões e os resultados associados.
    """
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
        return f"Simulado #{self.id} de {self.usuario.username} ({self.get_tipo_display()})"


class Resposta(models.Model):
    """
    Representa a resposta de um usuário a uma questão específica dentro de um simulado.
    """
    simulado = models.ForeignKey(Simulado, on_delete=models.CASCADE)
    questao = models.ForeignKey(Questao, on_delete=models.CASCADE)
    resposta_usuario = models.CharField(max_length=1, choices=RESPOSTA_CHOICES)
    correta = models.BooleanField(default=False)

    def __str__(self):
        return f"Resposta para Questão #{self.questao.id} no Simulado #{self.simulado.id}"