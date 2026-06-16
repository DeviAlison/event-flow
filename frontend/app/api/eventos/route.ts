import { NextResponse } from 'next/server';

// Força o Next.js a não fazer cache agressivo desta rota de teste
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // 1. Captura os parâmetros de busca enviados pelo seu Dashboard
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase() || '';
  const categoria = searchParams.get('categoria') || '';
  const pagina = parseInt(searchParams.get('pagina') || '1');

  // 2. Sua lista completa com os 24 casos de teste
  const todosEventos = [
    {
      "id_evento": 1,
      "titulo": "Semana Acadêmica de Engenharia",
      "preco": 50,
      "status": 1,
      "porcen_vend": 85,
      "categoria": "Tecnologia",
      "data": "15/08/2026",
      "hora": "19:00",
      "endereco": {
        "local": "Campus Principal",
        "rua": "Estrada Rural, km 35",
        "cidade": "Muzambinho",
        "estado": "MG"
      },
      "quant_reacoes": 124
    },
    {
      "id_evento": 2,
      "titulo": "Hackathon Code The Future",
      "preco": 0,
      "status": 1,
      "porcen_vend": 100,
      "categoria": "Hackathon",
      "data": "22/08/2026",
      "hora": "08:00",
      "endereco": {
        "local": "Centro de Convenções",
        "rua": "Av. João Pinheiro, 1000",
        "cidade": "Poços de Caldas",
        "estado": "MG"
      },
      "quant_reacoes": 342
    },
    {
      "id_evento": 3,
      "titulo": "Workshop de Infraestrutura e Cloud",
      "preco": 120,
      "status": 1,
      "porcen_vend": 45,
      "categoria": "Redes",
      "data": "05/09/2026",
      "hora": "14:00",
      "endereco": {
        "local": "Auditório Central",
        "rua": "Rua Gabriel Monteiro, 45",
        "cidade": "Alfenas",
        "estado": "MG"
      },
      "quant_reacoes": 56
    },
    {
      "id_evento": 4,
      "titulo": "Simpósio de Inteligência Artificial",
      "preco": 150,
      "status": 1,
      "porcen_vend": 60,
      "categoria": "Inteligência Artificial",
      "data": "10/10/2026",
      "hora": "08:30",
      "endereco": {
        "local": "Centro de Inovação",
        "rua": "Av. Tuany Toledo, 450",
        "cidade": "Pouso Alegre",
        "estado": "MG"
      },
      "quant_reacoes": 412
    },
    {
      "id_evento": 5,
      "titulo": "Encontro de Desenvolvedores Front-end",
      "preco": 0,
      "status": 1,
      "porcen_vend": 100,
      "categoria": "Desenvolvimento Web",
      "data": "18/10/2026",
      "hora": "18:00",
      "endereco": {
        "local": "Hub Criativo",
        "rua": "Rua Silva Jardim, 102",
        "cidade": "Varginha",
        "estado": "MG"
      },
      "quant_reacoes": 289
    },
    {
      "id_evento": 6,
      "titulo": "Bootcamp de Cibersegurança",
      "preco": 200,
      "status": 1,
      "porcen_vend": 95,
      "categoria": "Segurança",
      "data": "05/11/2026",
      "hora": "09:00",
      "endereco": {
        "local": "Laboratório de Redes",
        "rua": "Av. Brasil, 200",
        "cidade": "Machado",
        "estado": "MG"
      },
      "quant_reacoes": 156
    },
    {
      "id_evento": 7,
      "titulo": "Congresso de Engenharia de Software",
      "preco": 350,
      "status": 1,
      "porcen_vend": 30,
      "categoria": "Software",
      "data": "20/11/2026",
      "hora": "10:00",
      "endereco": {
        "local": "Expominas",
        "rua": "Av. Amazonas, 6200",
        "cidade": "Belo Horizonte",
        "estado": "MG"
      },
      "quant_reacoes": 890
    },
    {
      "id_evento": 8,
      "titulo": "Seminário de IoT e Automação",
      "preco": 80,
      "status": 1,
      "porcen_vend": 50,
      "categoria": "Hardware",
      "data": "02/12/2026",
      "hora": "13:30",
      "endereco": {
        "local": "Prédio da Engenharia",
        "rua": "Campus Universitário",
        "cidade": "Lavras",
        "estado": "MG"
      },
      "quant_reacoes": 210
    },
    {
      "id_evento": 9,
      "titulo": "Fórum de Ciência de Dados",
      "preco": 120,
      "status": 1,
      "porcen_vend": 75,
      "categoria": "Data Science",
      "data": "10/01/2027",
      "hora": "08:00",
      "endereco": {
        "local": "Teatro Municipal",
        "rua": "Praça Clarimundo Carneiro",
        "cidade": "Uberlândia",
        "estado": "MG"
      },
      "quant_reacoes": 345
    },
    {
      "id_evento": 10,
      "titulo": "Palestra: O Futuro da Web3",
      "preco": 0,
      "status": 1,
      "porcen_vend": 90,
      "categoria": "Blockchain",
      "data": "15/01/2027",
      "hora": "19:30",
      "endereco": {
        "local": "Auditório da Biblioteca",
        "rua": "Estrada Rural, km 35",
        "cidade": "Muzambinho",
        "estado": "MG"
      },
      "quant_reacoes": 432
    },
    {
      "id_evento": 11,
      "titulo": "Workshop de UX/UI Design",
      "preco": 60,
      "status": 1,
      "porcen_vend": 100,
      "categoria": "Design",
      "data": "22/01/2027",
      "hora": "14:00",
      "endereco": {
        "local": "Agência Cria",
        "rua": "Av. Norte Sul, 1500",
        "cidade": "Campinas",
        "estado": "SP"
      },
      "quant_reacoes": 678
    },
    {
      "id_evento": 12,
      "titulo": "Campeonato Nacional de Robótica",
      "preco": 45,
      "status": 1,
      "porcen_vend": 88,
      "categoria": "Robótica",
      "data": "10/02/2027",
      "hora": "09:00",
      "endereco": {
        "local": "Ginásio de Esportes",
        "rua": "Rua dos Atletas, 100",
        "cidade": "São Paulo",
        "estado": "SP"
      },
      "quant_reacoes": 1205
    },
    {
      "id_evento": 13,
      "titulo": "Curso Intensivo de Python",
      "preco": 180,
      "status": 1,
      "porcen_vend": 40,
      "categoria": "Programação",
      "data": "20/02/2027",
      "hora": "18:30",
      "endereco": {
        "local": "Polo de Informática",
        "rua": "Rua Assis Figueiredo, 500",
        "cidade": "Poços de Caldas",
        "estado": "MG"
      },
      "quant_reacoes": 315
    },
    {
      "id_evento": 14,
      "titulo": "Meetup de Cultura DevOps",
      "preco": 20,
      "status": 1,
      "porcen_vend": 100,
      "categoria": "DevOps",
      "data": "05/03/2027",
      "hora": "20:00",
      "endereco": {
        "local": "Pub do Vale",
        "rua": "Praça Getúlio Vargas, 12",
        "cidade": "Alfenas",
        "estado": "MG"
      },
      "quant_reacoes": 198
    },
    {
      "id_evento": 15,
      "titulo": "Conferência de Marketing Digital e SEO",
      "preco": 250,
      "status": 1,
      "porcen_vend": 65,
      "categoria": "Marketing",
      "data": "15/03/2027",
      "hora": "09:00",
      "endereco": {
        "local": "Hotel Copacabana Palace",
        "rua": "Av. Atlântica, 1702",
        "cidade": "Rio de Janeiro",
        "estado": "RJ"
      },
      "quant_reacoes": 876
    },
    {
      "id_evento": 16,
      "titulo": "Feira Regional de Startups",
      "preco": 0,
      "status": 1,
      "porcen_vend": 80,
      "categoria": "Empreendedorismo",
      "data": "28/03/2027",
      "hora": "10:00",
      "endereco": {
        "local": "Pátio Savassi",
        "rua": "Av. do Contorno, 6061",
        "cidade": "Belo Horizonte",
        "estado": "MG"
      },
      "quant_reacoes": 540
    },
    {
      "id_evento": 17,
      "titulo": "Seminário de Banco de Dados e NoSQL",
      "preco": 90,
      "status": 1,
      "porcen_vend": 55,
      "categoria": "Banco de Dados",
      "data": "10/04/2027",
      "hora": "15:00",
      "endereco": {
        "local": "Centro Cultural",
        "rua": "Rua Halfeld, 200",
        "cidade": "Juiz de Fora",
        "estado": "MG"
      },
      "quant_reacoes": 234
    },
    {
      "id_evento": 18,
      "titulo": "Treinamento em Metodologias Ágeis",
      "preco": 130,
      "status": 1,
      "porcen_vend": 90,
      "categoria": "Gestão",
      "data": "25/04/2027",
      "hora": "08:30",
      "endereco": {
        "local": "Sebrae Unidade",
        "rua": "Av. Vicente Simões, 550",
        "cidade": "Pouso Alegre",
        "estado": "MG"
      },
      "quant_reacoes": 312
    },
    {
      "id_evento": 19,
      "titulo": "Workshop de Realidade Virtual",
      "preco": 100,
      "status": 1,
      "porcen_vend": 45,
      "categoria": "Tecnologia",
      "data": "05/05/2027",
      "hora": "14:00",
      "endereco": {
        "local": "Espaço Maker",
        "rua": "Rua Santa Cruz, 89",
        "cidade": "Varginha",
        "estado": "MG"
      },
      "quant_reacoes": 175
    },
    {
      "id_evento": 20,
      "titulo": "Encontro de Mulheres na TI",
      "preco": 0,
      "status": 1,
      "porcen_vend": 100,
      "categoria": "Diversidade",
      "data": "15/05/2027",
      "hora": "19:00",
      "endereco": {
        "local": "Auditório Principal",
        "rua": "Estrada Rural, km 35",
        "cidade": "Muzambinho",
        "estado": "MG"
      },
      "quant_reacoes": 643
    },
    {
      "id_evento": 21,
      "titulo": "Bootcamp de Machine Learning",
      "preco": 280,
      "status": 1,
      "porcen_vend": 70,
      "categoria": "Inteligência Artificial",
      "data": "01/06/2027",
      "hora": "09:00",
      "endereco": {
        "local": "Tech Hub Universitário",
        "rua": "Campus UFLA",
        "cidade": "Lavras",
        "estado": "MG"
      },
      "quant_reacoes": 420
    },
    {
      "id_evento": 22,
      "titulo": "Palestra: Acessibilidade na Web",
      "preco": 30,
      "status": 1,
      "porcen_vend": 85,
      "categoria": "Desenvolvimento Web",
      "data": "12/06/2027",
      "hora": "19:30",
      "endereco": {
        "local": "Teatro Rotary",
        "rua": "Rua dos Bancários, 45",
        "cidade": "Passos",
        "estado": "MG"
      },
      "quant_reacoes": 218
    },
    {
      "id_evento": 23,
      "titulo": "Fórum Internacional de Cloud Computing",
      "preco": 400,
      "status": 0,
      "porcen_vend": 100,
      "categoria": "Cloud",
      "data": "20/06/2027",
      "hora": "08:00",
      "endereco": {
        "local": "Centro de Convenções",
        "rua": "Via Anhanguera, km 307",
        "cidade": "Ribeirão Preto",
        "estado": "SP"
      },
      "quant_reacoes": 980
    },
    {
      "id_evento": 24,
      "titulo": "Hackathon Cidades Inteligentes",
      "preco": 0,
      "status": 1,
      "porcen_vend": 98,
      "categoria": "Hackathon",
      "data": "05/07/2027",
      "hora": "18:00",
      "endereco": {
        "local": "Inovação Unifei",
        "rua": "Av. BPS, 1303",
        "cidade": "Itajubá",
        "estado": "MG"
      },
      "quant_reacoes": 765
    }
  ];

  // 3. Aplicação dos Filtros Dinâmicos
  let eventosFiltrados = todosEventos;

  if (categoria) {
    eventosFiltrados = eventosFiltrados.filter(e => e.categoria.toLowerCase() === categoria.toLowerCase());
  }

  if (search) {
    eventosFiltrados = eventosFiltrados.filter(e => 
      e.titulo.toLowerCase().includes(search) || 
      e.endereco.cidade.toLowerCase().includes(search) ||
      e.categoria.toLowerCase().includes(search)
    );
  }

  console.log(`[DEBUG] Categoria: "${categoria}" | Search: "${search}" | Total filtrado: ${eventosFiltrados.length} | Total geral: ${todosEventos.length}`);

  // 4. Aplicação da Paginação
  const qntd_item_pag = 30;
  const inicio = (pagina - 1) * qntd_item_pag;
  const fim = inicio + qntd_item_pag;
  const eventosPaginados = eventosFiltrados.slice(inicio, fim);

  // 5. Retorno estruturado conforme o contrato estabelecido com o Frontend
  const dados = {
    "paginacao": {
      "pagina": pagina,
      "qntd_item_pag": qntd_item_pag
    },
    "eventos": eventosPaginados
  };

  return NextResponse.json(dados);
}