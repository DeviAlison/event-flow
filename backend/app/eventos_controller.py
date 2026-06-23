from datetime import datetime

# Simulando o banco de dados. 
# Status: 1 (Ativo), 2 (No Radar), 3 (Finalizado)
eventos_mock = [
    {
        "id_evento": 101,
        "titulo": "Festival de Inverno de Muzambinho",
        "preco": 120.00,
        "status": 1, 
        "porcen_vend": 85,
        "categoria": "Show",
        "data": "15/07/2026",
        "hora": "20:00",
        "local": "Parque de Exposições",
        "localizacao": {
            "numero": 1000,
            "endereco": "Av. Principal",
            "cidade": "Muzambinho",
            "estado": "MG"
        },
        "quant_reacoes": 450
    },
    {
        "id_evento": 102,
        "titulo": "Tech Future Expo",
        "preco": 0.00,
        "status": 2, 
        "porcen_vend": 10,
        "categoria": "Tecnologia",
        "data": "10/11/2026",
        "hora": "09:00",
        "local": "Centro de Convenções",
        "localizacao": {
            "numero": 500,
            "endereco": "Rua da Inovação",
            "cidade": "São Paulo",
            "estado": "SP"
        },
        "quant_reacoes": 890
    },
    {
        "id_evento": 103,
        "titulo": "Echo Beats Festival",
        "preco": 60.00,
        "status": 3, 
        "porcen_vend": 100,
        "categoria": "Music",
        "data": "20/05/2026",
        "hora": "18:00",
        "local": "Sunset Park",
        "localizacao": {
            "numero": 10,
            "endereco": "Via Costeira",
            "cidade": "Rio de Janeiro",
            "estado": "RJ"
        },
        "quant_reacoes": 1200
    }
]

def obter_vitrine_eventos(filtros):
    resultados = eventos_mock.copy()

    # US 4: Filtros Rápidos de Status
    status_filtro = filtros.get('status')
    if status_filtro:
        # Converte a string da URL para o código inteiro correspondente
        mapa_status = {"Ativos": 1, "No Radar": 2, "Finalizados": 3}
        codigo_status = mapa_status.get(status_filtro)
        if codigo_status:
            resultados = [e for e in resultados if e["status"] == codigo_status]

    # US 3: Barra de Pesquisa Global (Busca Textual)
    search_filtro = filtros.get('search')
    if search_filtro and len(search_filtro) >= 3:
        termo = search_filtro.lower()
        # O Tech Lead pediu busca por Artista e Produtora, mas como seu JSON 
        # atual não tem esses campos, estamos buscando apenas no título por enquanto.
        resultados = [e for e in resultados if termo in e["titulo"].lower()]

    # Filtro Extra: Categoria
    categoria_filtro = filtros.get('categoria')
    if categoria_filtro:
        resultados = [e for e in resultados if e["categoria"].lower() == categoria_filtro.lower()]

    # US 2: Regra de Ordenação (Peso)
    # Ordena primariamente por Hype (quant_reacoes) decrescente
    resultados.sort(key=lambda x: x["quant_reacoes"], reverse=True)

    # US 2: Limite de Exibição (Paginação limitando a 30)
    resultados_paginados = resultados[:30]

    # Montagem da estrutura de saída idêntica ao seu modelo JSON
    resposta = {
        "paginacao": {
            "pagina": 1,
            "qntd_item_pag": len(resultados_paginados)
        },
        "eventos": resultados_paginados
    }

    return resposta, 200