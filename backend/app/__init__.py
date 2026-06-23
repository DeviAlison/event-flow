from flask import Flask
from config import Config
from app.models import db

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    db.init_app(app)
 
    # Registro das rotas de Autenticação
    from app.routes import auth_bp
    app.register_blueprint(auth_bp)

    # Registro das novas rotas de Eventos
    from app.eventos_routes import eventos_bp
    app.register_blueprint(eventos_bp)

    # No futuro, é aqui que vamos registrar o routes.py

    return app