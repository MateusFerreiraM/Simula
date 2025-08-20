#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

# Bloco de Limpeza Condicional
if [ "$RUN_FLUSH" = "True" ]; then
  echo "!!! VARIÁVEL RUN_FLUSH DETETADA - LIMPANDO O BANCO DE DADOS !!!"
  python manage.py flush --no-input
  echo "!!! BANCO DE DADOS LIMPO COM SUCESSO !!!"
fi

python manage.py collectstatic --no-input
python manage.py migrate

# Carrega os dois fixtures, em ordem
echo "Carregando fixture de questões..."
python manage.py loaddata questoes_finais.json

echo "Carregando fixture de usuário admin..."
python manage.py loaddata admin_user.json