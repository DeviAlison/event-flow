import os
from dotenv import load_dotenv

# Carrega as variáveis do arquivo .env
load_dotenv()

class Config:
    # Pega a chave do .env. Se não achar, usa uma padrão.
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'default_secret_key_event_flow'