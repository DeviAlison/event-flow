from flask import Blueprint, request, jsonify
from app.eventos_controller import (
    obter_vitrine_eventos,
    obter_detalhes_evento,
    alternar_curtida_evento,
    adicionar_comentario, 
    editar_comentario, 
    deletar_comentario, 
    alternar_curtida_comentario
)
from app.decorators import token_obrigatorio

eventos_bp = Blueprint('eventos', __name__)

@eventos_bp.route('/api/eventos', methods=['GET'])
def listar_eventos():
    filtros = {
        'status': request.args.get('status'),
        'data_evento': request.args.get('data'),
        'search': request.args.get('search'),
        'categoria': request.args.get('categoria'),
        'pagina': request.args.get('pagina', 1, type=int)
    }

    resposta, status_code = obter_vitrine_eventos(filtros)
    return jsonify(resposta), status_code


@eventos_bp.route('/api/eventos/<int:id>', methods=['GET'])
def detalhes(id):
    resposta, status_code = obter_detalhes_evento(id)
    return jsonify(resposta), status_code


@eventos_bp.route('/api/eventos/<int:id>/curtir', methods=['POST'])
@token_obrigatorio
def curtir_evento(usuario_logado_email, id):
    resposta, status_code = alternar_curtida_evento(id, usuario_logado_email)
    return jsonify(resposta), status_code

@eventos_bp.route('/api/eventos/<int:id>/comentarios', methods=['POST'])
@token_obrigatorio
def publicar_comentario(usuario_logado_email, id):
    dados = request.get_json()
    resposta, status = adicionar_comentario(id, usuario_logado_email, dados)
    return jsonify(resposta), status

@eventos_bp.route('/api/comentarios/<int:id_comentario>', methods=['PUT'])
@token_obrigatorio
def modificar_comentario(usuario_logado_email, id_comentario):
    dados = request.get_json()
    resposta, status = editar_comentario(id_comentario, usuario_logado_email, dados)
    return jsonify(resposta), status

@eventos_bp.route('/api/comentarios/<int:id_comentario>', methods=['DELETE'])
@token_obrigatorio
def remover_comentario(usuario_logado_email, id_comentario):
    resposta, status = deletar_comentario(id_comentario, usuario_logado_email)
    return jsonify(resposta), status

@eventos_bp.route('/api/comentarios/<int:id_comentario>/curtir', methods=['POST'])
@token_obrigatorio
def curtir_coment(usuario_logado_email, id_comentario):
    resposta, status = alternar_curtida_comentario(id_comentario, usuario_logado_email)
    return jsonify(resposta), status