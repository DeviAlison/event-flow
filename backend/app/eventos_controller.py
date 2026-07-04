from datetime import datetime

from app.models import Usuario, Comentario, Evento, Categoria, TipoIngresso, Lote, Curtida, db
from sqlalchemy import func


def obter_vitrine_eventos(filtros):

    query = Evento.query.join(Categoria).outerjoin(Curtida)

    # Filtro por status
    status_filtro = filtros.get('status')

    if status_filtro == "Ativos":
        query = query.filter(Evento.status == 'Publicado')

    elif status_filtro == "Finalizados":
        query = query.filter(Evento.status == 'Encerrado')

    elif status_filtro == "No Radar":
        query = query.filter(
            Evento.data_inicio.is_(None)
        ).filter(
            (Evento.nome_local.is_(None)) |
            (Evento.nome_local == '')
        )
    # Filtro por busca
    search_filtro = filtros.get('search')
    if search_filtro and len(search_filtro) >= 3:
        query = query.filter(Evento.nome.ilike(f"%{search_filtro}%"))

    # Filtro por categoria
    categoria_filtro = filtros.get('categoria')
    if categoria_filtro:
        query = query.filter(Categoria.nome.ilike(f"%{categoria_filtro}%"))

    # Filtro por data (dd/mm/yyyy)
    data_filtro = filtros.get('data_evento')
    if data_filtro:
        try:
            data = datetime.strptime(data_filtro, '%d/%m/%Y').date()
            query = query.filter(func.date(Evento.data_inicio) == data)
        except ValueError:
            return {"erro": "Data inválida. Use o formato dd/mm/yyyy"}, 400

    # Ordenação
    query = query.group_by(*Evento.__table__.columns).order_by(
        func.count(Curtida.idcurtidas).desc(),
        Evento.data_inicio.asc()
    )

    # Paginação
    ITENS_POR_PAGINA = 30
    pagina = int(filtros.get('pagina', 1))

    paginacao = query.paginate(
        page=pagina,
        per_page=ITENS_POR_PAGINA,
        error_out=False
    )

    eventos_db = paginacao.items

    resultados_formatados = []

    for evento in eventos_db:

        preco_base = 0.00
        ingressos_vendidos = 0
        ingressos_totais = 0

        for tipo in evento.tipos_ingresso:
            for lote in tipo.lotes:

                if preco_base == 0.00 or lote.preco < preco_base:
                    preco_base = float(lote.preco)

                # Ajuste aqui caso o nome correto da coluna seja quant_total
                if lote.quant_total and lote.quant_vendida:
                    ingressos_totais += lote.quant_total
                    ingressos_vendidos += lote.quant_vendida

        porcen_vend = (
            int((ingressos_vendidos / ingressos_totais) * 100)
            if ingressos_totais > 0
            else 0
        )

        resultados_formatados.append({
            "id_evento": evento.ideventos,
            "titulo": evento.nome,
            "imagem": evento.imagem_url,
            "preco": preco_base,
            "status": 1 if evento.status == 'Publicado' else 3,
            "porcen_vend": porcen_vend,
            "categoria": evento.categoria.nome if evento.categoria else "Sem categoria",
            "data": evento.data_inicio.strftime('%d/%m/%Y') if evento.data_inicio else "",
            "hora": evento.data_inicio.strftime('%H:%M') if evento.data_inicio else "",
            "local": evento.nome_local,
            "localizacao": {
                "numero": evento.numero_end,
                "endereco": evento.endereco,
                "cidade": evento.cidade,
                "estado": evento.estado
            },
            "quant_reacoes": evento.curtidas.count()
        })

    resposta = {
        "paginacao": {
            "pagina": pagina,
            "qntd_item_pag": ITENS_POR_PAGINA,
            "total_itens": paginacao.total,
            "total_paginas": paginacao.pages
        },
        "eventos": resultados_formatados
    }

    return resposta, 200

def obter_detalhes_evento(id_evento):
    evento = Evento.query.get(id_evento)
    
    if not evento:
        return {"erro": "Evento não encontrado"}, 404

    # Estruturando os ingressos dinamicamente
    modalidades_ingresso = []
    for tipo in evento.tipos_ingresso:
        lotes_ativos = []
        for lote in tipo.lotes:
            lotes_ativos.append({
                "numero_lote": lote.numero_lote,
                "preco": float(lote.preco),
                "esgotado": lote.quant_vendida >= lote.quant_total if lote.quant_total else False
            })
            
        modalidades_ingresso.append({
            "id_tipo": tipo.idtipo_ingresso,
            "nome": tipo.nome,
            "lotes": lotes_ativos
        })

    # Estruturando os comentários raiz
    comentarios_lista = []
    # Busca apenas comentários que não têm pai (ou seja, são a raiz)
    comentarios_raiz = evento.comentarios_recebidos.filter(Comentario.comentariopai == None).all()
    
    for com in comentarios_raiz:
        comentarios_lista.append({
            "id": com.idcomentario,
            "autor": com.usuario.nome,
            "texto": com.texto,
            "data": com.data.strftime('%d/%m/%Y %H:%M') if com.data else None
            # Depois adicionaremos as respostas e likes aqui dentro
        })

    resposta = {
        "id_evento": evento.ideventos,
        "titulo": evento.nome,
        "descricao": evento.descricao,
        "data_inicio": evento.data_inicio.strftime('%d/%m/%Y %H:%M') if evento.data_inicio else None,
        "localizacao": f"{evento.nome_local} - {evento.cidade}/{evento.estado}",
        "quant_reacoes": evento.curtidas.count(),
        "ingressos": modalidades_ingresso,
        "comentarios": comentarios_lista
    }

    return resposta, 200

# --- Endpoint: POST /api/eventos/:id/curtir ---
def alternar_curtida_evento(id_evento, email_usuario):
    evento = Evento.query.get(id_evento)
    if not evento:
        return {"erro": "Evento não encontrado"}, 404

    usuario = Usuario.query.filter_by(email=email_usuario).first()
    if not usuario:
        return {"erro": "Usuário inválido"}, 401

    # Verifica se a curtida já existe
    curtida_existente = Curtida.query.filter_by(
        eventos_ideventos=id_evento, 
        usuarios_idusuarios=usuario.idusuarios
    ).first()

    if curtida_existente:
        # Toggle: Se já curtiu, desfazer a curtida
        db.session.delete(curtida_existente)
        db.session.commit()
        return {"message": "Curtida removida", "status_curtido": False}, 200
    else:
        # Toggle: Se não curtiu, registrar curtida
        nova_curtida = Curtida(eventos_ideventos=id_evento, usuarios_idusuarios=usuario.idusuarios)
        db.session.add(nova_curtida)
        db.session.commit()
        return {"message": "Evento curtido", "status_curtido": True}, 201