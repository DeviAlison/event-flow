from flask import Blueprint, request, jsonify
from app.eventos_controller import obter_vitrine_eventos, obter_detalhes_evento, alternar_curtida_evento
from app.decorators import token_obrigatorio # O middleware que criamos anteriormente

eventos_bp = Blueprint('eventos', __name__)

# Recomendo atualizar a sua rota antiga de vitrine para seguir o padrão do Tech Lead:
@eventos_bp.route('/api/eventos', methods=['GET'])
def listar_eventos():
    filtros = {
        'status': request.args.get('status'),
        'search': request.args.get('search'),
        'categoria': request.args.get('categoria')
    }
    resposta, status_code = obter_vitrine_eventos(filtros)
    return jsonify(resposta), status_code

# --- NOVAS ROTAS ---

@eventos_bp.route('/api/eventos/<int:id>', methods=['GET'])
def detalhes(id):
    resposta, status_code = obter_detalhes_evento(id)
    return jsonify(resposta), status_code

@eventos_bp.route('/api/eventos/<int:id>/curtir', methods=['POST'])
@token_obrigatorio
def curtir_evento(usuario_logado_email, id):
    # Passamos o email do token e o ID do evento da URL para o controller
    resposta, status_code = alternar_curtida_evento(id, usuario_logado_email)
    return jsonify(resposta), status_code