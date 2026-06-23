import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'chave_padrao_insegura'
    
    # Configuração da URL do banco de dados
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    
    # Desativa os avisos de modificação do SQLAlchemy para economizar memória
    SQLALCHEMY_TRACK_MODIFICATIONS = False