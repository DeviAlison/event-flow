from flask import Blueprint, request, jsonify
from app.eventos_controller import obter_vitrine_eventos

eventos_bp = Blueprint('eventos', __name__)

# US 1: Acesso Público. Note que NÃO usamos o @token_obrigatorio aqui!
@eventos_bp.route('/eventos', methods=['GET'])
def listar_eventos():
    # Captura os Query Parameters da URL (?status=Ativos&search=Festival)
    filtros = {
        'status': request.args.get('status'),
        'data_evento': request.args.get('data'),
        'search': request.args.get('search'),
        'categoria': request.args.get('categoria')
    }
    
    resposta, status_code = obter_vitrine_eventos(filtros)
    
    return jsonify(resposta), status_code