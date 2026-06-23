from flask import Blueprint, request, jsonify
from app.controllers import (
    registrar_usuario, 
    autenticar_usuario, 
    confirmar_conta,
    solicitar_recuperacao,
    redefinir_senha_com_token
)

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    dados = request.get_json()
    resposta, status_code = registrar_usuario(dados)
    return jsonify(resposta), status_code

@auth_bp.route('/confirmar-conta', methods=['POST'])
def confirmar():
    dados = request.get_json()
    email = dados.get("email")
    token = dados.get("token")
    resposta, status_code = confirmar_conta(email, token)
    return jsonify(resposta), status_code

@auth_bp.route('/login', methods=['POST'])
def login():
    dados = request.get_json()
    email = dados.get("email")
    senha = dados.get("senha")
    resposta, status_code = autenticar_usuario(email, senha)
    return jsonify(resposta), status_code

@auth_bp.route('/esqueci-senha', methods=['POST'])
def esqueci_senha():
    dados = request.get_json()
    email = dados.get("email")
    resposta, status_code = solicitar_recuperacao(email)
    return jsonify(resposta), status_code

@auth_bp.route('/redefinir-senha', methods=['PUT'])
def redefinir_senha():
    dados = request.get_json()
    email = dados.get("email")
    token = dados.get("token")
    nova_senha = dados.get("nova_senha")
    resposta, status_code = redefinir_senha_com_token(email, token, nova_senha)
    return jsonify(resposta), status_code