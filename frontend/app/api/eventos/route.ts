import { NextResponse } from 'next/server';

// Força o Next.js a não fazer cache agressivo desta rota de teste
export const dynamic = 'force-dynamic';

function buildReacoes(quantReacoes: number) {
  const total = quantReacoes || 0;
  const curtir = Math.floor(total * 0.4);
  const amei = Math.floor(total * 0.25);
  const fogo = Math.floor(total * 0.2);
  const festa = Math.max(0, total - curtir - amei - fogo);
  return { curtir, amei, fogo, festa };
}

function buildComentarios(evento: { id_evento: number; titulo: string; comentarios?: unknown[] }) {
  if (Array.isArray(evento.comentarios) && evento.comentarios.length > 0) {
    return evento.comentarios;
  }

  const baseId = evento.id_evento * 100;

  return [
    {
      id: baseId + 1,
      autor: "Ana Clara",
      mensagem: `Alguém mais confirmado para ${evento.titulo}?`,
      criadoEm: "2h atrás",
      respostas: [
        {
          id: baseId + 11,
          autor: "Lucas",
          mensagem: "Eu vou! Podemos nos encontrar na entrada principal.",
          criadoEm: "1h atrás",
          respostas: [],
        },
      ],
    },
    {
      id: baseId + 2,
      autor: "Gabriel",
      mensagem: "Vai ter estacionamento no local ou indicação de onde deixar o carro?",
      criadoEm: "3h atrás",
      respostas: [
        {
          id: baseId + 21,
          autor: "Organização",
          mensagem: "Sim, há estacionamento pago ao lado do venue e vagas gratuitas na rua lateral.",
          criadoEm: "2h atrás",
          respostas: [],
        },
      ],
    },
  ];
}

export async function GET(request: Request) {
  // 1. Captura os parâmetros de busca enviados pelo seu Dashboard
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase() || '';
  const statusParam = searchParams.get('status')?.toLowerCase() || '';
  const pagina = parseInt(searchParams.get('pagina') || '1');

  const statusMap = {
    ativo: 1,
    'no radar': 0,
    'noradar': 0,
    finalizado: 2,
  } as const;

  const filtroStatus = statusParam ? statusMap[statusParam as keyof typeof statusMap] : undefined;

  // 2. Sua lista completa com os 34 casos de teste
  const todosEventos = [
    {
      "id_evento": 1,
      "titulo": "Semana Acadêmica de Engenharia",
      "preco": 50,
      "status": 1,
      "porcen_vend": 85,
      "categoria": "Tecnologia",
      "subgenero": "Inovação",
      "data": "15/08/2026",
      "hora": "19:00",
      "endereco": {
        "local": "Campus Principal",
        "rua": "Estrada Rural, km 35",
        "cidade": "Muzambinho",
        "estado": "MG"
      },
      "ingressos_disponiveis": 38,
      "ingressos_totais": 200,
      "descricao": "A Semana Acadêmica reúne palestras, workshops e painéis para quem quer se aprofundar em engenharia e tecnologia.\n- Palestras com grandes referências do mercado.\n- Apresentações de projetos estudantis.\n- Networking com empresas parceiras.",
      "imagens": [
        "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
      ],
      "variacoes_ingressos": [
        {
          "id": "1-pista",
          "nome": "Pista",
          "preco": 50,
          "descricao": "Acesso completo ao auditório e área de networking."
        },
        {
          "id": "1-vip",
          "nome": "VIP",
          "preco": 120,
          "descricao": "Assentos reservados, kit de boas-vindas e acesso à sala vip."
        }
      ],
      "quant_reacoes": 124
    },
    {
      "id_evento": 2,
      "titulo": "Hackathon Code The Future",
      "preco": 0,
      "status": 1,
      "porcen_vend": 100,
      "categoria": "Hackathon",
      "subgenero": "Desenvolvimento",
      "data": "22/08/2026",
      "hora": "08:00",
      "endereco": {
        "local": "Centro de Convenções",
        "rua": "Av. João Pinheiro, 1000",
        "cidade": "Poços de Caldas",
        "estado": "MG"
      },
      "ingressos_disponiveis": 0,
      "ingressos_totais": 120,
      "descricao": "Participe do maior hackathon estudantil do ano, com prêmios, mentorias e infraestrutura completa.\n- Equipes de até 4 participantes.\n- Mentorias de grandes empresas.\n- Premiação para melhor projeto.",
      "imagens": [
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"
      ],
      "variacoes_ingressos": [
        {
          "id": "2-padrao",
          "nome": "Padrão",
          "preco": 0,
          "descricao": "Acesso completo ao hackathon e refeições."
        },
        {
          "id": "2-mentor",
          "nome": "Mentoria Premium",
          "preco": 70,
          "descricao": "Inclui mentorias exclusivas e kit de hackathon."
        }
      ],
      "quant_reacoes": 342
    },
    {
      "id_evento": 3,
      "titulo": "Workshop de Infraestrutura e Cloud",
      "preco": 120,
      "status": 1,
      "porcen_vend": 45,
      "categoria": "Redes",
      "subgenero": "Cloud Computing",
      "data": "05/09/2026",
      "hora": "14:00",
      "endereco": {
        "local": "Auditório Central",
        "rua": "Rua Gabriel Monteiro, 45",
        "cidade": "Alfenas",
        "estado": "MG"
      },
      "ingressos_disponiveis": 165,
      "ingressos_totais": 300,
      "descricao": "Aprenda a configurar e gerenciar infraestrutura em nuvem com AWS, Azure e Google Cloud.\n- Hands-on com ferramentas reais.\n- Segurança e escalabilidade.\n- Certificados de participação.",
      "imagens": [
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
      ],
      "variacoes_ingressos": [
        {
          "id": "3-presencial",
          "nome": "Presencial",
          "preco": 120,
          "descricao": "Acesso ao workshop com acesso a laboratórios de prática."
        },
        {
          "id": "3-online",
          "nome": "Online",
          "preco": 80,
          "descricao": "Transmissão ao vivo com acesso às gravações por 30 dias."
        },
        {
          "id": "3-premium",
          "nome": "Premium",
          "preco": 200,
          "descricao": "Presencial + mentorias individuais + certificado avançado."
        }
      ],
      "quant_reacoes": 156
    },
    {
      "id_evento": 4,
      "titulo": "Simpósio de Inteligência Artificial",
      "preco": 150,
      "status": 1,
      "porcen_vend": 60,
      "categoria": "Inteligência Artificial",
      "subgenero": "Machine Learning",
      "data": "10/10/2026",
      "hora": "08:30",
      "endereco": {
        "local": "Centro de Inovação",
        "rua": "Av. Tuany Toledo, 450",
        "cidade": "Pouso Alegre",
        "estado": "MG"
      },
      "ingressos_disponiveis": 80,
      "ingressos_totais": 200,
      "descricao": "Conheça os avanços em IA, deep learning e redes neurais com especialistas da indústria.\n- Apresentações de projetos em produção.\n- Workshop prático com TensorFlow e PyTorch.\n- Networking com pesquisadores do MIT e Stanford.",
      "imagens": [
        "https://images.unsplash.com/photo-1677442d019cecf4d4f6f9fcd6c28b00?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1553531889-e6cf89d45394?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80"
      ],
      "variacoes_ingressos": [
        {
          "id": "4-estudante",
          "nome": "Estudante",
          "preco": 80,
          "descricao": "Acesso com apresentação de comprovante de matrícula."
        },
        {
          "id": "4-profissional",
          "nome": "Profissional",
          "preco": 150,
          "descricao": "Acesso completo + kit de materiais + almoço premium."
        },
        {
          "id": "4-platinum",
          "nome": "Platinum",
          "preco": 300,
          "descricao": "Tudo acima + 2 horas de consultoria com palestrantes."
        }
      ],
      "quant_reacoes": 412
    },
    {
      "id_evento": 5,
      "titulo": "Encontro de Desenvolvedores Front-end",
      "preco": 0,
      "status": 1,
      "porcen_vend": 100,
      "categoria": "Desenvolvimento Web",
      "subgenero": "React & Vue",
      "data": "18/10/2026",
      "hora": "18:00",
      "endereco": {
        "local": "Hub Criativo",
        "rua": "Rua Silva Jardim, 102",
        "cidade": "Varginha",
        "estado": "MG"
      },
      "ingressos_disponiveis": 0,
      "ingressos_totais": 150,
      "descricao": "Encontro gratuito para discutir tendências em front-end: React 18, Vue 3 e Web Components.\n- Talks de 20 minutos com Q&A.\n- Demonstrações ao vivo de projetos.\n- Cerveja e petiscos após o evento.",
      "imagens": [
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1633356122544-f134ef2944f3?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=1200&q=80"
      ],
      "variacoes_ingressos": [
        {
          "id": "5-presencial",
          "nome": "Presencial",
          "preco": 0,
          "descricao": "Gratuito - vagas limitadas, inscrição antecipada."
        }
      ],
      "quant_reacoes": 289
    },
    {
      "id_evento": 6,
      "titulo": "Bootcamp de Cibersegurança",
      "preco": 200,
      "status": 1,
      "porcen_vend": 95,
      "categoria": "Segurança",
      "subgenero": "Pentesting",
      "data": "05/11/2026",
      "hora": "09:00",
      "endereco": {
        "local": "Laboratório de Redes",
        "rua": "Av. Brasil, 200",
        "cidade": "Machado",
        "estado": "MG"
      },
      "ingressos_disponiveis": 10,
      "ingressos_totais": 200,
      "descricao": "Bootcamp intensivo de 4 dias em cibersegurança, pentesting e hardening de sistemas.\n- Laboratórios práticos com máquinas vulneráveis.\n- CTF (Capture The Flag) competitivo.\n- Certificado de conclusão reconhecido.",
      "imagens": [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1563986768609-322da13e763f?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1526374965328-7f5ae4e8b08f?auto=format&fit=crop&w=1200&q=80"
      ],
      "variacoes_ingressos": [
        {
          "id": "6-basico",
          "nome": "Básico",
          "preco": 200,
          "descricao": "Acesso aos 4 dias de bootcamp com materiais."
        },
        {
          "id": "6-avancado",
          "nome": "Avançado",
          "preco": 350,
          "descricao": "Inclui mentoria individual e acesso vitalício ao repositório de labs."
        }
      ],
      "quant_reacoes": 156
    },
    {
      "id_evento": 7,
      "titulo": "Congresso de Engenharia de Software",
      "preco": 350,
      "status": 2,
      "porcen_vend": 30,
      "categoria": "Software",
      "subgenero": "Arquitetura",
      "data": "20/11/2026",
      "hora": "10:00",
      "endereco": {
        "local": "Expominas",
        "rua": "Av. Amazonas, 6200",
        "cidade": "Belo Horizonte",
        "estado": "MG"
      },
      "ingressos_disponiveis": 350,
      "ingressos_totais": 500,
      "descricao": "Congresso anual sobre tendências e boas práticas em engenharia de software.\n- Keynotes com renomados arquitetos de software.\n- Trilhas paralelas: DDD, Microsserviços, Clean Code.\n- Expo de ferramentas e empresas.",
      "imagens": [
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80"
      ],
      "variacoes_ingressos": [
        {
          "id": "7-early",
          "nome": "Early Bird",
          "preco": 280,
          "descricao": "Ingresso antecipado com 20% de desconto até 31/08."
        },
        {
          "id": "7-normal",
          "nome": "Normal",
          "preco": 350,
          "descricao": "Acesso completo ao congresso."
        },
        {
          "id": "7-vip",
          "nome": "VIP",
          "preco": 500,
          "descricao": "Acesso VIP + networking jantar + kit exclusivo."
        }
      ],
      "quant_reacoes": 890
    },
    {
      "id_evento": 8,
      "titulo": "Seminário de IoT e Automação",
      "preco": 80,
      "status": 1,
      "porcen_vend": 50,
      "categoria": "Hardware",
      "subgenero": "Sistemas Embarcados",
      "data": "02/12/2026",
      "hora": "13:30",
      "endereco": {
        "local": "Prédio da Engenharia",
        "rua": "Campus Universitário",
        "cidade": "Lavras",
        "estado": "MG"
      },
      "ingressos_disponiveis": 100,
      "ingressos_totais": 200,
      "descricao": "Explorando IoT, Arduino, Raspberry Pi e automação residencial.\n- Projetos práticos com sensores e atuadores.\n- Integração com cloud (AWS IoT, Azure).\n- Case de sucesso de automação industrial.",
      "imagens": [
        "https://images.unsplash.com/photo-1591290619762-b0e24ef0bb77?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1535944304123-ed8c88d9197e?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80"
      ],
      "variacoes_ingressos": [
        {
          "id": "8-presencial",
          "nome": "Presencial",
          "preco": 80,
          "descricao": "Acesso ao seminário com kit IoT educativo."
        },
        {
          "id": "8-online",
          "nome": "Online",
          "preco": 50,
          "descricao": "Transmissão ao vivo com vídeos sob demanda por 90 dias."
        }
      ],
      "quant_reacoes": 210
    },
    {
      "id_evento": 9,
      "titulo": "Fórum de Ciência de Dados",
      "preco": 120,
      "status": 1,
      "porcen_vend": 75,
      "categoria": "Data Science",
      "subgenero": "Analytics",
      "data": "10/01/2027",
      "hora": "08:00",
      "endereco": {
        "local": "Teatro Municipal",
        "rua": "Praça Clarimundo Carneiro",
        "cidade": "Uberlândia",
        "estado": "MG"
      },
      "ingressos_disponiveis": 50,
      "ingressos_totais": 200,
      "descricao": "Fórum dedicado a ciência de dados, análise e big data com profissionais da área.\n- Workshops: SQL, Python, Tableau.\n- Cases reais de empresas Fortune 500.\n- Discussão sobre carreira em Data Science.",
      "imagens": [
        "https://images.unsplash.com/photo-1516321318423-f06f70d504f0?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80"
      ],
      "variacoes_ingressos": [
        {
          "id": "9-aluno",
          "nome": "Aluno",
          "preco": 80,
          "descricao": "Acesso com ID estudantil válido."
        },
        {
          "id": "9-profissional",
          "nome": "Profissional",
          "preco": 120,
          "descricao": "Acesso completo com certificado."
        }
      ],
      "quant_reacoes": 345
    },
    {
      "id_evento": 10,
      "titulo": "Palestra: O Futuro da Web3",
      "preco": 0,
      "status": 1,
      "porcen_vend": 90,
      "categoria": "Blockchain",
      "subgenero": "Criptomoedas",
      "data": "15/01/2027",
      "hora": "19:30",
      "endereco": {
        "local": "Auditório da Biblioteca",
        "rua": "Estrada Rural, km 35",
        "cidade": "Muzambinho",
        "estado": "MG"
      },
      "ingressos_disponiveis": 20,
      "ingressos_totais": 200,
      "descricao": "Palestra gratuita sobre o futuro da Web3, blockchain e descentralização.\n- Fundamentais de criptomoedas e DeFi.\n- Smart contracts e sua aplicação prática.\n- Oportunidades de carreira em blockchain.",
      "imagens": [
        "https://images.unsplash.com/photo-1516321318423-f06f70d504f0?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1526304640581-d334cdbbf35f?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80"
      ],
      "variacoes_ingressos": [
        {
          "id": "10-gratuito",
          "nome": "Gratuito",
          "preco": 0,
          "descricao": "Inscrição antecipada obrigatória, vagas limitadas."
        }
      ],
      "quant_reacoes": 432
    },
    {
      "id_evento": 11,
      "titulo": "Workshop de UX/UI Design",
      "preco": 60,
      "status": 1,
      "porcen_vend": 100,
      "categoria": "Design",
      "subgenero": "Design de Interfaces",
      "data": "22/01/2027",
      "hora": "14:00",
      "endereco": {
        "local": "Agência Cria",
        "rua": "Av. Norte Sul, 1500",
        "cidade": "Campinas",
        "estado": "SP"
      },
      "ingressos_disponiveis": 0,
      "ingressos_totais": 80,
      "descricao": "Workshop prático de design de experiência do usuário com ferramentas modernas.\n- Design Thinking e User Research.\n- Figma avançado e prototipagem.\n- Portfolio review com designers renomados.",
      "imagens": [
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1576153192396-180ecef2a715?auto=format&fit=crop&w=1200&q=80"
      ],
      "variacoes_ingressos": [
        {
          "id": "11-workshop",
          "nome": "Workshop",
          "preco": 60,
          "descricao": "Acesso ao workshop com kit de materiais e café."
        }
      ],
      "quant_reacoes": 678
    },
    {
      "id_evento": 12,
      "titulo": "Campeonato Nacional de Robótica",
      "preco": 45,
      "status": 1,
      "porcen_vend": 88,
      "categoria": "Robótica",
      "subgenero": "Competição",
      "data": "10/02/2027",
      "hora": "09:00",
      "endereco": {
        "local": "Ginásio de Esportes",
        "rua": "Rua dos Atletas, 100",
        "cidade": "São Paulo",
        "estado": "SP"
      },
      "ingressos_disponiveis": 24,
      "ingressos_totais": 200,
      "descricao": "Campeonato nacional de robótica com equipes de todo o Brasil.\n- Competições nas categorias Sumô, Resgate e Futebol de Robôs.\n- Premiação: até R$ 50 mil em prêmios.\n- Oportunidades de networking entre engenheiros.",
      "imagens": [
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1591290619762-b0e24ef0bb77?auto=format&fit=crop&w=1200&q=80"
      ],
      "variacoes_ingressos": [
        {
          "id": "12-publico",
          "nome": "Público",
          "preco": 45,
          "descricao": "Ingresso para assistir a todas as competições."
        },
        {
          "id": "12-equipe",
          "nome": "Inscrição de Equipe",
          "preco": 500,
          "descricao": "Para 5 participantes e kit do campeonato."
        }
      ],
      "quant_reacoes": 1205
    },
    {
      "id_evento": 13,
      "titulo": "Curso Intensivo de Python",
      "preco": 180,
      "status": 1,
      "porcen_vend": 40,
      "categoria": "Programação",
      "subgenero": "Linguagens",
      "data": "20/02/2027",
      "hora": "18:30",
      "endereco": {
        "local": "Polo de Informática",
        "rua": "Rua Assis Figueiredo, 500",
        "cidade": "Poços de Caldas",
        "estado": "MG"
      },
      "ingressos_disponiveis": 120,
      "ingressos_totais": 200,
      "descricao": "Curso intensivo de 5 dias para iniciantes em Python.\n- Fundamentos: variáveis, loops, funções.\n- Orientação a objetos e módulos populares.\n- Projeto final com os alunos.",
      "imagens": [
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1633356122544-f134ef2944f3?auto=format&fit=crop&w=1200&q=80"
      ],
      "variacoes_ingressos": [
        {
          "id": "13-individual",
          "nome": "Individual",
          "preco": 180,
          "descricao": "Acesso ao curso de 5 dias com material didático."
        },
        {
          "id": "13-grupo",
          "nome": "Grupo (3+)",
          "preco": 150,
          "descricao": "Desconto de 17% por pessoa para grupos."
        }
      ],
      "quant_reacoes": 315
    },
    {
      "id_evento": 14,
      "titulo": "Meetup de Cultura DevOps",
      "preco": 20,
      "status": 1,
      "porcen_vend": 100,
      "categoria": "DevOps",
      "subgenero": "Operações",
      "data": "05/03/2027",
      "hora": "20:00",
      "endereco": {
        "local": "Pub do Vale",
        "rua": "Praça Getúlio Vargas, 12",
        "cidade": "Alfenas",
        "estado": "MG"
      },
      "ingressos_disponiveis": 0,
      "ingressos_totais": 100,
      "descricao": "Meetup informal sobre cultura DevOps, CI/CD e automação.\n- Talks de profissionais da área.\n- Discussão sobre desafios e soluções.\n- Happy hour com networking.",
      "imagens": [
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
      ],
      "variacoes_ingressos": [
        {
          "id": "14-presencial",
          "nome": "Presencial",
          "preco": 20,
          "descricao": "Acesso ao meetup com 1 bebida incluída."
        }
      ],
      "quant_reacoes": 198
    },
    {
      "id_evento": 15,
      "titulo": "Conferência de Marketing Digital e SEO",
      "preco": 250,
      "status": 1,
      "porcen_vend": 65,
      "categoria": "Marketing",
      "subgenero": "Digital",
      "data": "15/03/2027",
      "hora": "09:00",
      "endereco": {
        "local": "Hotel Copacabana Palace",
        "rua": "Av. Atlântica, 1702",
        "cidade": "Rio de Janeiro",
        "estado": "RJ"
      },
      "ingressos_disponiveis": 105,
      "ingressos_totais": 300,
      "descricao": "Conferência com especialistas em SEO, SEM e estratégia de marketing digital.\n- Google Ads e Facebook Ads avançado.\n- Análise de concorrência e posicionamento.\n- Case de empresas que cresceram 10x com marketing digital.",
      "imagens": [
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80"
      ],
      "variacoes_ingressos": [
        {
          "id": "15-basico",
          "nome": "Básico",
          "preco": 250,
          "descricao": "Acesso à conferência com café da manhã."
        },
        {
          "id": "15-completo",
          "nome": "Completo",
          "preco": 400,
          "descricao": "Tudo acima + almoço + networking jantar."
        }
      ],
      "quant_reacoes": 876
    },
    {
      "id_evento": 16,
      "titulo": "Feira Regional de Startups",
      "preco": 0,
      "status": 1,
      "porcen_vend": 80,
      "categoria": "Empreendedorismo",
      "subgenero": "Inovação",
      "data": "28/03/2027",
      "hora": "10:00",
      "endereco": {
        "local": "Pátio Savassi",
        "rua": "Av. do Contorno, 6061",
        "cidade": "Belo Horizonte",
        "estado": "MG"
      },
      "ingressos_disponiveis": 80,
      "ingressos_totais": 400,
      "descricao": "Feira gratuita onde startups apresentam seus produtos e buscam investidores.\n- Pitch de startups selecionadas.\n- Workshops de empreendedorismo.\n- Oportunidades para networking.",
      "imagens": [
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
      ],
      "variacoes_ingressos": [
        {
          "id": "16-visitante",
          "nome": "Visitante",
          "preco": 0,
          "descricao": "Acesso gratuito à feira."
        },
        {
          "id": "16-startup",
          "nome": "Inscrição Startup",
          "preco": 1500,
          "descricao": "Espaço de estande + pitch de 10 minutos."
        }
      ],
      "quant_reacoes": 540
    },
    {
      "id_evento": 17,
      "titulo": "Seminário de Banco de Dados e NoSQL",
      "preco": 90,
      "status": 1,
      "porcen_vend": 55,
      "categoria": "Banco de Dados",
      "subgenero": "NoSQL",
      "data": "10/04/2027",
      "hora": "15:00",
      "endereco": {
        "local": "Centro Cultural",
        "rua": "Rua Halfeld, 200",
        "cidade": "Juiz de Fora",
        "estado": "MG"
      },
      "ingressos_disponiveis": 90,
      "ingressos_totais": 200,
      "descricao": "Seminário sobre MongoDB, Cassandra, Redis e outras tecnologias NoSQL.\n- Comparação: SQL vs NoSQL.\n- Modelagem de dados em MongoDB.\n- Otimização de queries e performance.",
      "imagens": [
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1516321318423-f06f70d504f0?auto=format&fit=crop&w=1200&q=80"
      ],
      "variacoes_ingressos": [
        {
          "id": "17-presencial",
          "nome": "Presencial",
          "preco": 90,
          "descricao": "Acesso ao seminário com material de referência."
        }
      ],
      "quant_reacoes": 234
    },
    {
      "id_evento": 18,
      "titulo": "Treinamento em Metodologias Ágeis",
      "preco": 130,
      "status": 1,
      "porcen_vend": 90,
      "categoria": "Gestão",
      "subgenero": "Scrum",
      "data": "25/04/2027",
      "hora": "08:30",
      "endereco": {
        "local": "Sebrae Unidade",
        "rua": "Av. Vicente Simões, 550",
        "cidade": "Pouso Alegre",
        "estado": "MG"
      },
      "ingressos_disponiveis": 20,
      "ingressos_totais": 200,
      "descricao": "Treinamento de 2 dias em Scrum, Kanban e metodologias ágeis.\n- Certificado de Scrum Master candidate.\n- Exercícios práticos e simulações.\n- Prep para exames de certificação.",
      "imagens": [
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1531498860502-7c67cf02f657?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80"
      ],
      "variacoes_ingressos": [
        {
          "id": "18-presencial",
          "nome": "Presencial",
          "preco": 130,
          "descricao": "2 dias de treinamento com certificação."
        },
        {
          "id": "18-online",
          "nome": "Online",
          "preco": 100,
          "descricao": "Treinamento síncrono com acesso às gravações."
        }
      ],
      "quant_reacoes": 312
    },
    {
      "id_evento": 19,
      "titulo": "Workshop de Realidade Virtual",
      "preco": 100,
      "status": 1,
      "porcen_vend": 45,
      "categoria": "Tecnologia",
      "subgenero": "VR/AR",
      "data": "05/05/2027",
      "hora": "14:00",
      "endereco": {
        "local": "Espaço Maker",
        "rua": "Rua Santa Cruz, 89",
        "cidade": "Varginha",
        "estado": "MG"
      },
      "ingressos_disponiveis": 165,
      "ingressos_totais": 300,
      "descricao": "Workshop prático sobre desenvolvimento em VR/AR com Unity e Unreal Engine.\n- Criação de ambientes imersivos.\n- Interatividade e gamification em VR.\n- Demonstração com HTC Vive e Meta Quest.",
      "imagens": [
        "https://images.unsplash.com/photo-1617638924702-92a37c418f2d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1478416272538-5f7e51dc5400?auto=format&fit=crop&w=1200&q=80"
      ],
      "variacoes_ingressos": [
        {
          "id": "19-basico",
          "nome": "Básico",
          "preco": 100,
          "descricao": "Acesso ao workshop com tutorial de VR."
        },
        {
          "id": "19-premium",
          "nome": "Premium",
          "preco": 180,
          "descricao": "Acesso + Headset VR para levar para casa."
        }
      ],
      "quant_reacoes": 175
    },
    {
      "id_evento": 20,
      "titulo": "Encontro de Mulheres na TI",
      "preco": 0,
      "status": 1,
      "porcen_vend": 100,
      "categoria": "Diversidade",
      "subgenero": "Inclusão",
      "data": "15/05/2027",
      "hora": "19:00",
      "endereco": {
        "local": "Auditório Principal",
        "rua": "Estrada Rural, km 35",
        "cidade": "Muzambinho",
        "estado": "MG"
      },
      "ingressos_disponiveis": 0,
      "ingressos_totais": 200,
      "descricao": "Encontro anual para fortalecer a presença de mulheres na tecnologia.\n- Histórias de inspiração de mulheres em tech.\n- Mesa redonda: desafios e oportunidades.\n- Networking com profissionais senior da área.",
      "imagens": [
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1515169067865-5387ec356754?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1485217988980-11786ced9454?auto=format&fit=crop&w=1200&q=80"
      ],
      "variacoes_ingressos": [
        {
          "id": "20-presencial",
          "nome": "Presencial",
          "preco": 0,
          "descricao": "Gratuito com inscrição antecipada."
        }
      ],
      "quant_reacoes": 643
    },
    {
      "id_evento": 21,
      "titulo": "Bootcamp de Machine Learning",
      "preco": 280,
      "status": 1,
      "porcen_vend": 70,
      "categoria": "Inteligência Artificial",
      "subgenero": "Machine Learning",
      "data": "01/06/2027",
      "hora": "09:00",
      "endereco": {
        "local": "Tech Hub Universitário",
        "rua": "Campus UFLA",
        "cidade": "Lavras",
        "estado": "MG"
      },
      "ingressos_disponiveis": 60,
      "ingressos_totais": 200,
      "descricao": "Bootcamp intensivo de 5 dias cobrindo todo o pipeline de machine learning.\n- Regressão, classificação e clustering na prática.\n- Scikit-learn, XGBoost e redes neurais com Keras.\n- Projeto final com dataset real e apresentação para banca.",
      "imagens": [
        "https://images.unsplash.com/photo-1677442d019cecf4d4f6f9fcd6c28b00?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1516321318423-f06f70d504f0?auto=format&fit=crop&w=1200&q=80"
      ],
      "variacoes_ingressos": [
        {
          "id": "21-estudante",
          "nome": "Estudante",
          "preco": 180,
          "descricao": "Acesso com comprovante de matrícula vigente."
        },
        {
          "id": "21-profissional",
          "nome": "Profissional",
          "preco": 280,
          "descricao": "Acesso completo com certificado e material didático."
        },
        {
          "id": "21-premium",
          "nome": "Premium",
          "preco": 420,
          "descricao": "Tudo acima + mentoria individual e acesso vitalício aos labs."
        }
      ],
      "quant_reacoes": 420
    },
    {
      "id_evento": 22,
      "titulo": "Palestra: Acessibilidade na Web",
      "preco": 30,
      "status": 1,
      "porcen_vend": 85,
      "categoria": "Desenvolvimento Web",
      "subgenero": "Acessibilidade",
      "data": "12/06/2027",
      "hora": "19:30",
      "endereco": {
        "local": "Teatro Rotary",
        "rua": "Rua dos Bancários, 45",
        "cidade": "Passos",
        "estado": "MG"
      },
      "ingressos_disponiveis": 30,
      "ingressos_totais": 200,
      "descricao": "Palestra sobre boas práticas de acessibilidade digital e conformidade com WCAG 2.1.\n- Semântica HTML e uso correto de ARIA.\n- Testes com leitores de tela (NVDA, VoiceOver).\n- Como auditar e corrigir barreiras de acessibilidade.",
      "imagens": [
        "https://images.unsplash.com/photo-1508830524289-0adcbe822b40?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80"
      ],
      "variacoes_ingressos": [
        {
          "id": "22-geral",
          "nome": "Geral",
          "preco": 30,
          "descricao": "Acesso à palestra e material de referência digital."
        }
      ],
      "quant_reacoes": 218
    },
    {
      "id_evento": 23,
      "titulo": "Fórum Internacional de Cloud Computing",
      "preco": 400,
      "status": 0,
      "porcen_vend": 100,
      "categoria": "Cloud",
      "subgenero": "Multi-Cloud",
      "data": "20/06/2027",
      "hora": "08:00",
      "endereco": {
        "local": "Centro de Convenções",
        "rua": "Via Anhanguera, km 307",
        "cidade": "Ribeirão Preto",
        "estado": "SP"
      },
      "ingressos_disponiveis": 0,
      "ingressos_totais": 500,
      "descricao": "Fórum internacional reunindo arquitetos de cloud das maiores empresas do mundo.\n- Estratégias multi-cloud e hybrid cloud.\n- FinOps: otimização de custos em nuvem.\n- Painéis com executivos da AWS, Azure e Google Cloud.",
      "imagens": [
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80"
      ],
      "variacoes_ingressos": [
        {
          "id": "23-presencial",
          "nome": "Presencial",
          "preco": 400,
          "descricao": "Acesso completo ao fórum com almoço e coffee break."
        },
        {
          "id": "23-vip",
          "nome": "VIP",
          "preco": 700,
          "descricao": "Acesso VIP + sessão privada com palestrantes internacionais."
        }
      ],
      "quant_reacoes": 980
    },
    {
      "id_evento": 24,
      "titulo": "Hackathon Cidades Inteligentes",
      "preco": 0,
      "status": 1,
      "porcen_vend": 98,
      "categoria": "Hackathon",
      "subgenero": "Smart Cities",
      "data": "05/07/2027",
      "hora": "18:00",
      "endereco": {
        "local": "Inovação Unifei",
        "rua": "Av. BPS, 1303",
        "cidade": "Itajubá",
        "estado": "MG"
      },
      "ingressos_disponiveis": 4,
      "ingressos_totais": 200,
      "descricao": "Hackathon com foco em soluções tecnológicas para mobilidade urbana, saúde pública e sustentabilidade.\n- Equipes de 3 a 5 pessoas.\n- Mentores de prefeituras parceiras e setor privado.\n- Premiação: R$ 30 mil e aceleração do projeto vencedor.",
      "imagens": [
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&q=80"
      ],
      "variacoes_ingressos": [
        {
          "id": "24-participante",
          "nome": "Participante",
          "preco": 0,
          "descricao": "Gratuito. Inclui refeições, infraestrutura e kit hackathon."
        }
      ],
      "quant_reacoes": 765
    },
    {
      "id_evento": 25,
      "titulo": "Roda de Conversa sobre Sustentabilidade Tech",
      "preco": 20,
      "status": 0,
      "porcen_vend": 55,
      "categoria": "Tecnologia",
      "subgenero": "Green Tech",
      "data": "10/07/2027",
      "hora": "14:00",
      "endereco": {
        "local": "Espaço Verde",
        "rua": "Rua das Palmeiras, 200",
        "cidade": "Poços de Caldas",
        "estado": "MG"
      },
      "ingressos_disponiveis": 90,
      "ingressos_totais": 200,
      "descricao": "Conversa aberta sobre o impacto ambiental da tecnologia e como o setor pode ser mais sustentável.\n- Consumo energético de data centers e IA.\n- E-waste e descarte responsável de eletrônicos.\n- Iniciativas green tech de empresas brasileiras.",
      "imagens": [
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80"
      ],
      "variacoes_ingressos": [
        {
          "id": "25-geral",
          "nome": "Geral",
          "preco": 20,
          "descricao": "Acesso à roda de conversa com material informativo."
        }
      ],
      "quant_reacoes": 112
    },
    {
      "id_evento": 26,
      "titulo": "Noite de Jogos e Programação",
      "preco": 0,
      "status": 1,
      "porcen_vend": 65,
      "categoria": "Programação",
      "subgenero": "Game Dev",
      "data": "15/07/2027",
      "hora": "19:30",
      "endereco": {
        "local": "Lab. de Informática",
        "rua": "Av. Universitária, 88",
        "cidade": "Campinas",
        "estado": "SP"
      },
      "ingressos_disponiveis": 70,
      "ingressos_totais": 200,
      "descricao": "Evento descontraído unindo desenvolvimento de jogos e competição de coding.\n- Mini game jam com tema surpresa.\n- Batalha de algoritmos ao vivo.\n- Premiação simbólica e muita diversão.",
      "imagens": [
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80"
      ],
      "variacoes_ingressos": [
        {
          "id": "26-gratuito",
          "nome": "Gratuito",
          "preco": 0,
          "descricao": "Entrada gratuita. Leve seu notebook!"
        }
      ],
      "quant_reacoes": 230
    },
    {
      "id_evento": 27,
      "titulo": "Pitch Night de Startups",
      "preco": 45,
      "status": 2,
      "porcen_vend": 80,
      "categoria": "Empreendedorismo",
      "subgenero": "Pitch",
      "data": "20/07/2027",
      "hora": "18:00",
      "endereco": {
        "local": "Centro de Eventos Empresariais",
        "rua": "Av. Bento Gonçalves, 1234",
        "cidade": "Belo Horizonte",
        "estado": "MG"
      },
      "ingressos_disponiveis": 40,
      "ingressos_totais": 200,
      "descricao": "Noite de pitches onde startups em estágio inicial apresentam suas soluções para investidores anjos.\n- Pitches de 5 minutos + 3 minutos de perguntas.\n- Avaliação por banca de investidores.\n- Networking pós-evento com open bar.",
      "imagens": [
        "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80"
      ],
      "variacoes_ingressos": [
        {
          "id": "27-visitante",
          "nome": "Visitante",
          "preco": 45,
          "descricao": "Acesso como espectador ao pitch night e networking."
        },
        {
          "id": "27-startup",
          "nome": "Inscrição Startup",
          "preco": 0,
          "descricao": "Gratuito para startups selecionadas que irão apresentar."
        }
      ],
      "quant_reacoes": 412
    },
    {
      "id_evento": 28,
      "titulo": "Maratona de Desenvolvimento Mobile",
      "preco": 150,
      "status": 1,
      "porcen_vend": 40,
      "categoria": "Desenvolvimento Web",
      "subgenero": "Mobile",
      "data": "28/07/2027",
      "hora": "09:00",
      "endereco": {
        "local": "Hub de Inovação",
        "rua": "Rua da Tecnologia, 256",
        "cidade": "Uberlândia",
        "estado": "MG"
      },
      "ingressos_disponiveis": 120,
      "ingressos_totais": 200,
      "descricao": "Maratona de 3 dias com foco em desenvolvimento de apps para iOS e Android.\n- React Native e Flutter do zero ao deploy.\n- Publicação nas lojas: App Store e Google Play.\n- Revisão de código e UX com especialistas.",
      "imagens": [
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1633356122544-f134ef2944f3?auto=format&fit=crop&w=1200&q=80"
      ],
      "variacoes_ingressos": [
        {
          "id": "28-individual",
          "nome": "Individual",
          "preco": 150,
          "descricao": "Acesso aos 3 dias da maratona com material e refeições."
        },
        {
          "id": "28-dupla",
          "nome": "Dupla",
          "preco": 260,
          "descricao": "Ingresso para 2 participantes com desconto de 13%."
        }
      ],
      "quant_reacoes": 179
    },
    {
      "id_evento": 29,
      "titulo": "Oficina de Segurança em Aplicações",
      "preco": 100,
      "status": 0,
      "porcen_vend": 70,
      "categoria": "Segurança",
      "subgenero": "AppSec",
      "data": "05/08/2027",
      "hora": "16:00",
      "endereco": {
        "local": "Faculdade de Engenharia",
        "rua": "Av. Paraná, 500",
        "cidade": "São Paulo",
        "estado": "SP"
      },
      "ingressos_disponiveis": 60,
      "ingressos_totais": 200,
      "descricao": "Oficina prática de segurança em aplicações web e mobile com foco em OWASP Top 10.\n- Identificação e exploração de vulnerabilidades.\n- SQL Injection, XSS e CSRF na prática.\n- Como implementar medidas preventivas no ciclo de desenvolvimento.",
      "imagens": [
        "https://images.unsplash.com/photo-1526374965328-7f5ae4e8b08f?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1563986768609-322da13e763f?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80"
      ],
      "variacoes_ingressos": [
        {
          "id": "29-presencial",
          "nome": "Presencial",
          "preco": 100,
          "descricao": "Acesso à oficina com laboratório prático e material de apoio."
        },
        {
          "id": "29-online",
          "nome": "Online",
          "preco": 70,
          "descricao": "Transmissão ao vivo com acesso às gravações por 60 dias."
        }
      ],
      "quant_reacoes": 341
    },
    {
      "id_evento": 30,
      "titulo": "Seminário de Blockchain e Cripto",
      "preco": 220,
      "status": 1,
      "porcen_vend": 90,
      "categoria": "Blockchain",
      "subgenero": "Criptomoedas",
      "data": "12/08/2027",
      "hora": "10:00",
      "endereco": {
        "local": "Teatro do Centro",
        "rua": "Praça do Comércio, 80",
        "cidade": "Ribeirão Preto",
        "estado": "SP"
      },
      "ingressos_disponiveis": 20,
      "ingressos_totais": 200,
      "descricao": "Seminário aprofundado sobre blockchain, criptoativos e o ecossistema DeFi no Brasil e no mundo.\n- Regulação cripto no Brasil: Marco Legal das Criptomoedas.\n- NFTs, tokenização de ativos reais e RWA.\n- Painel com traders, desenvolvedores e juristas.",
      "imagens": [
        "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1526304640581-d334cdbbf35f?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1516321318423-f06f70d504f0?auto=format&fit=crop&w=1200&q=80"
      ],
      "variacoes_ingressos": [
        {
          "id": "30-geral",
          "nome": "Geral",
          "preco": 220,
          "descricao": "Acesso completo ao seminário com coffee break."
        },
        {
          "id": "30-vip",
          "nome": "VIP",
          "preco": 380,
          "descricao": "Acesso VIP + sessão exclusiva com palestrantes e jantar de networking."
        }
      ],
      "quant_reacoes": 514
    },
    {
      "id_evento": 31,
      "titulo": "Expo de Inteligência Artificial",
      "preco": 180,
      "status": 2,
      "porcen_vend": 75,
      "categoria": "Inteligência Artificial",
      "subgenero": "Inovação",
      "data": "22/08/2027",
      "hora": "09:30",
      "endereco": {
        "local": "Centro de Convenções",
        "rua": "Av. Brasil, 700",
        "cidade": "Campinas",
        "estado": "SP"
      },
      "ingressos_disponiveis": 50,
      "ingressos_totais": 200,
      "descricao": "Maior exposição de produtos e soluções de IA do interior paulista.\n- Demonstrações ao vivo de LLMs, visão computacional e agentes autônomos.\n- Área de experiências interativas com IA generativa.\n- Palestras e painéis com pesquisadores e CTOs.",
      "imagens": [
        "https://images.unsplash.com/photo-1677442d019cecf4d4f6f9fcd6c28b00?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1553531889-e6cf89d45394?auto=format&fit=crop&w=1200&q=80"
      ],
      "variacoes_ingressos": [
        {
          "id": "31-visitante",
          "nome": "Visitante",
          "preco": 180,
          "descricao": "Acesso à expo e palestras abertas."
        },
        {
          "id": "31-expositor",
          "nome": "Expositor",
          "preco": 2000,
          "descricao": "Estande 3x3m com energia, internet e credenciais ilimitadas."
        }
      ],
      "quant_reacoes": 650
    },
    {
      "id_evento": 32,
      "titulo": "Meetup de DevOps e Automação",
      "preco": 30,
      "status": 1,
      "porcen_vend": 85,
      "categoria": "DevOps",
      "subgenero": "Automação",
      "data": "28/08/2027",
      "hora": "17:00",
      "endereco": {
        "local": "Coworking Tech",
        "rua": "Rua dos Devs, 208",
        "cidade": "Poços de Caldas",
        "estado": "MG"
      },
      "ingressos_disponiveis": 30,
      "ingressos_totais": 200,
      "descricao": "Meetup mensal com foco em automação de infraestrutura, pipelines e plataformas.\n- Talks sobre Terraform, Ansible e GitHub Actions.\n- Live coding de pipeline CI/CD do zero.\n- Networking e troca de experiências entre times de plataforma.",
      "imagens": [
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
      ],
      "variacoes_ingressos": [
        {
          "id": "32-presencial",
          "nome": "Presencial",
          "preco": 30,
          "descricao": "Acesso ao meetup com coffee e 1 bebida incluída."
        }
      ],
      "quant_reacoes": 287
    },
    {
      "id_evento": 33,
      "titulo": "Fórum de Inclusão Digital",
      "preco": 0,
      "status": 0,
      "porcen_vend": 60,
      "categoria": "Diversidade",
      "subgenero": "Inclusão",
      "data": "03/09/2027",
      "hora": "15:00",
      "endereco": {
        "local": "Auditório Comunitário",
        "rua": "Av. dos Sonhos, 22",
        "cidade": "Muzambinho",
        "estado": "MG"
      },
      "ingressos_disponiveis": 80,
      "ingressos_totais": 200,
      "descricao": "Fórum gratuito sobre acesso à tecnologia e redução da exclusão digital no Brasil.\n- Realidade da conectividade em cidades pequenas e zonas rurais.\n- Programas de letramento digital para populações vulneráveis.\n- Debate com representantes de governo, ONG e setor privado.",
      "imagens": [
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1485217988980-11786ced9454?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1515169067865-5387ec356754?auto=format&fit=crop&w=1200&q=80"
      ],
      "variacoes_ingressos": [
        {
          "id": "33-gratuito",
          "nome": "Gratuito",
          "preco": 0,
          "descricao": "Entrada gratuita e aberta a toda a comunidade."
        }
      ],
      "quant_reacoes": 179
    },
    {
      "id_evento": 34,
      "titulo": "Hackathon Saúde Digital",
      "preco": 0,
      "status": 1,
      "porcen_vend": 95,
      "categoria": "Hackathon",
      "subgenero": "HealthTech",
      "data": "10/09/2027",
      "hora": "09:00",
      "endereco": {
        "local": "Hospital Universitário",
        "rua": "Rua da Saúde, 350",
        "cidade": "Pouso Alegre",
        "estado": "MG"
      },
      "ingressos_disponiveis": 10,
      "ingressos_totais": 200,
      "descricao": "Hackathon com foco em soluções digitais para saúde pública e hospitalar.\n- Desafios reais propostos pelo hospital parceiro.\n- Mentoria com médicos, enfermeiros e gestores de saúde.\n- Premiação: R$ 20 mil e POC validada no hospital.",
      "imagens": [
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80"
      ],
      "variacoes_ingressos": [
        {
          "id": "34-participante",
          "nome": "Participante",
          "preco": 0,
          "descricao": "Gratuito. Inclui refeições, alojamento e kit hackathon."
        }
      ],
      "quant_reacoes": 322
    }
  ];

  const imagensPadrao = [
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1515169067865-5387ec356754?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1515169067865-5387ec356754?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1485217988980-11786ced9454?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
  ];

  const eventosCompletos = todosEventos.map((evento, index) => {
    const defaultImages = [
      imagensPadrao[index % imagensPadrao.length],
      imagensPadrao[(index + 1) % imagensPadrao.length],
    ];

    const defaultDescription = evento.descricao ||
      `Detalhes completos para ${evento.titulo}.\n- Estrutura completa e equipe preparada.\n- Networking e conteúdo de alto valor.\n- Local equipado para a melhor experiência.`;

    const defaultTickets = evento.variacoes_ingressos?.length > 0 ? evento.variacoes_ingressos : [
      {
        id: `${evento.id_evento}-pista`,
        nome: "Pista",
        preco: evento.preco ?? 0,
        descricao: "Acesso geral ao evento e área comum.",
      },
      {
        id: `${evento.id_evento}-vip`,
        nome: "VIP",
        preco: evento.preco ? Math.round(evento.preco * 1.8) : 100,
        descricao: "Área exclusiva, melhor visibilidade e benefícios especiais.",
      }
    ];

    const total = evento.ingressos_totais ?? 200;
    const disponiveis = evento.ingressos_disponiveis ?? Math.max(0, Math.min(total, Math.round((100 - (evento.porcen_vend ?? 0)) / 100 * total)));

    return {
      subgenero: evento.subgenero || evento.categoria,
      descricao: defaultDescription,
      imagens: evento.imagens?.length > 0 ? evento.imagens : defaultImages,
      variacoes_ingressos: defaultTickets,
      ingressos_disponiveis: disponiveis,
      ingressos_totais: total,
      descricao_long: evento.descricao_long || defaultDescription,
      ...evento,
      comentarios: buildComentarios(evento),
      reacoes: evento.reacoes ?? buildReacoes(evento.quant_reacoes ?? 0),
    };
  });

  // 3. Aplicação dos Filtros Dinâmicos
  let eventosFiltrados = eventosCompletos;

  if (filtroStatus !== undefined) {
    eventosFiltrados = eventosFiltrados.filter(e => e.status === filtroStatus);
  }

  if (search) {
    eventosFiltrados = eventosFiltrados.filter(e =>
      e.titulo.toLowerCase().includes(search) ||
      e.endereco.cidade.toLowerCase().includes(search) ||
      e.categoria.toLowerCase().includes(search)
    );
  }

  console.log(`[DEBUG] Status: "${statusParam}" | Search: "${search}" | Total filtrado: ${eventosFiltrados.length} | Total geral: ${todosEventos.length}`);

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

export async function POST(request: Request) {
  try {
    const dados = await request.json();

    // Simula o tempo de resposta do servidor (1.5 segundos)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simula a resposta de sucesso do backend
    return NextResponse.json({
      mensagem: "Evento criado com sucesso!",
      eventoRecebido: dados
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ erro: "Erro ao processar criação do evento." }, { status: 500 });
  }
}