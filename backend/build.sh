#!/usr/bin/env bash
# exit on error
set -o errexit

# Instala as dependências do Python
pip install -r requirements.txt

# Bloco de Limpeza Condicional (mantido para uso futuro, se necessário)
# Se a variável de ambiente RUN_FLUSH for 'True', limpa todos os dados do BD.
if [ "$RUN_FLUSH" = "True" ]; then
  echo "!!! VARIÁVEL RUN_FLUSH DETETADA - LIMPANDO O BANCO DE DADOS !!!"
  python manage.py flush --no-input
  echo "!!! BANCO DE DADOS LIMPO COM SUCESSO !!!"
fi

# Coleta os ficheiros estáticos para o WhiteNoise servir
python manage.py collectstatic --no-input

# Aplica as migrações do banco de dados
python manage.py migrate

# Carrega os dados iniciais a partir do único ficheiro de dados mestre
echo "Carregando dados iniciais (questões e admin)..."
python manage.py loaddata dados_finais_com_admin.json