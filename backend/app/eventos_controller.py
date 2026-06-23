from app.models import Evento, Categoria, TipoIngresso, Lote, Curtida, db
from sqlalchemy import func

def obter_vitrine_eventos(filtros):
    # Inicia a consulta base. Usamos outerjoin na Curtida para não excluir eventos sem likes.
    query = Evento.query.join(Categoria).outerjoin(Curtida)

    # ... (MANTENHA OS FILTROS DA US 4 E US 3 EXATAMENTE COMO FIZEMOS ANTES) ...
    status_filtro = filtros.get('status')
    if status_filtro == "Ativos":
        query = query.filter(Evento.status == 'Publicado')
    elif status_filtro == "Finalizados":
        query = query.filter(Evento.status == 'Encerrado')

    search_filtro = filtros.get('search')
    if search_filtro and len(search_filtro) >= 3:
        query = query.filter(Evento.nome.ilike(f"%{search_filtro}%"))

    categoria_filtro = filtros.get('categoria')
    if categoria_filtro:
        query = query.filter(Categoria.nome.ilike(f"%{categoria_filtro}%"))

    # US 2: Regra de Ordenação (Peso)
    # Agrupamos por evento e ordenamos PRIMEIRO pelo total de curtidas (DESC) e DEPOIS pela data mais próxima (ASC)
    # US 2: Regra de Ordenação (Peso)
    # Passamos todas as colunas da tabela Evento para o GROUP BY para satisfazer o MySQL
    query = query.group_by(*Evento.__table__.columns).order_by(
        func.count(Curtida.idcurtidas).desc(), 
        Evento.data_inicio.asc()
    )
    
    eventos_db = query.limit(30).all()

    resultados_formatados = []
    for evento in eventos_db:
        # Lógica para encontrar o preço base (o menor preço do lote atual)
        preco_base = 0.00
        ingressos_vendidos = 0
        ingressos_totais = 0
        
        for tipo in evento.tipos_ingresso:
            for lote in tipo.lotes:
                # Pega o menor preço disponível
                if preco_base == 0.00 or lote.preco < preco_base:
                    preco_base = float(lote.preco)
                
                # Soma para calcular a % de lotação da barra de progresso (AC 3)
                if lote.quant_totais and lote.quant_vendida:
                    ingressos_totais += lote.quant_totais
                    ingressos_vendidos += lote.quant_vendida
        
        # Calcula a porcentagem de vendas
        porcen_vend = int((ingressos_vendidos / ingressos_totais) * 100) if ingressos_totais > 0 else 0

        resultados_formatados.append({
            "id_evento": evento.ideventos,
            "titulo": evento.nome,
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
            # Conta as curtidas deste evento específico
            "quant_reacoes": evento.curtidas.count() 
        })

    resposta = {
        "paginacao": {
            "pagina": 1,
            "qntd_item_pag": len(resultados_formatados)
        },
        "eventos": resultados_formatados
    }

    return resposta, 200