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
python manage.py loaddata dados_finais_com_admin.json