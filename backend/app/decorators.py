from functools import wraps
from flask import request, jsonify, current_app
import jwt

def token_obrigatorio(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')

        if not token:
            return jsonify({"erro": "Token não enviado"}), 401

        try:
            token = token.replace("Bearer ", "")
            dados = jwt.decode(
                token,
                current_app.config['SECRET_KEY'],
                algorithms=["HS256"]
            )
            usuario_logado = dados["user"]

        except jwt.ExpiredSignatureError:
            return jsonify({"erro": "Token expirado"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"erro": "Token inválido"}), 401

        # Se tudo der certo, passa o usuário logado para a função da rota
        return f(usuario_logado, *args, **kwargs)

    return decorated