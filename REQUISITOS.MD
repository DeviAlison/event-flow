# Documento de Requisitos: EventFlow 🎪
**Autor:** Adivinha? kkkk
**Data:** Maio de 2026
**Versão:** 1.0

---

## 📌 Visão Geral do Produto
O EventFlow visa ser a plataforma definitiva para descoberta, organização e participação em eventos físicos. Este documento mapeia em alto nível as necessidades do negócio (Requisitos Funcionais) e os critérios de qualidade do sistema (Requisitos Não Funcionais) para orientar as equipes de Front-end, Back-end e Banco de Dados no desenvolvimento do MVP (Minimum Viable Product).

---

### Padrões do Board
No caso de funcionalidades que possuam integração entre back e front, a primeira subtask deve ser a definição do contrato de API (endpoints, payloads, respostas), onde todos participarão.

---

## 🎯 Requisitos Funcionais (Funcionalidades)


### Epic 1: Homepage e Descoberta Inicial (Vitrine)

Este épico concentra-se na primeira impressão do usuário ao acessar a plataforma, com foco total em conversão, retenção e coleta de intenção de compra, minimizando qualquer barreira de entrada.

* **RF-01: Acesso Público (Frictionless)**
  - O usuário deve conseguir acessar a Homepage, visualizar eventos e utilizar a busca de forma totalmente aberta, sem a exigência de estar logado no sistema.


* **RF-02: Motor de Busca Superior**
  - A interface deve contar com uma barra de pesquisa global em destaque na parte superior da página, permitindo a busca por termos textuais (nome do evento, artista ou local).


* **RF-03: Vitrine Principal de Eventos**
  - A página inicial deve renderizar uma listagem controlada de exatamente **30 eventos**, tendo na parte inferior direita um botão para navegação entre as demais páginas (tem de ter a contagem total de páginas).
  - O motor de recomendação/listagem deve ser regido por duas variáveis principais de ordenação:
  - **Hype:** Quantidade de reações/engajamento que o evento possui.
  - **Urgência:** Proximidade cronológica da data de realização do evento.


* **RF-04: Estrutura de Dados do Card do Evento**
  - Para garantir que o usuário tenha todas as informações vitais de relance, cada evento na vitrine deve exibir obrigatoriamente as seguintes informações agregadas à sua imagem de capa:
  - Nome do evento.
  - Data de realização.
  - Localização (Cidade/Estado ou Venue).
  - Preço (A partir de / Ingresso base).
  - Barra de progresso com o percentual de ingressos já comprados.
  - Contador numérico de "Hypes" (reações dos usuários).
  - Ícone visual sinalizando se o evento está **Ativo**.


* **RF-05: Filtros de Status (Acesso Rápido)**
  - A interface deve disponibilizar botões de filtro rápido para segmentar a vitrine em três estágios de vida dos eventos:
  - **Ativos:** Eventos confirmados por uma produtora, com data e local definidos. *Regra de negócio:* Deve incluir eventos com ingressos esgotados (Sold Out), permitindo que a empresa analise o tráfego e o interesse residual para justificar a abertura de lotes extras ou datas adicionais.
  - **No Radar:** Eventos em fase de ideação/captação. Não possuem data, preço ou local cravados. Funciona como uma "lista de espera às cegas" e termômetro de demanda para que os organizadores validem a viabilidade do evento antes de injetar verba.
  - **Finalizados:** Arquivo histórico contendo os anúncios e eventos que já tiveram sua data de realização expirada.

* **RF-06: Convite ao Cadastro**
  - O usuário deve ser convidado a se cadastrar ou fazer login ao tentar acessar funcionalidades que exigem autenticação, como por exemplo, a compra de ingressos, o hype de um evento, ou até mesmo a visualização mais detalhada dos eventos.
  - O convite deve ser feito de forma não intrusiva, utilizando modais ou banners sutis, e deve destacar os benefícios do cadastro (ex: acesso a ofertas exclusivas, histórico de compras, personalização de recomendações).

## ⚙️ Requisitos Não Funcionais (Critérios de Qualidade)

- **RNF-01: Performance (Front-end)**
  - O carregamento da Homepage e da Busca não deve ultrapassar 2 segundos. O uso do Next.js deve focar em SSR (Server-Side Rendering) para SEO nas páginas públicas.
- **RNF-02: Segurança e Conformidade**
  - Todos os dados sensíveis de pagamento não devem ser armazenados no nosso MySQL, mas sim tokenizados através de um Gateway de Pagamento (ex: Stripe, Pagar.me) para garantir conformidade com PCI-DSS.
  - As senhas devem ser hasheadas (ex: bcrypt) e a autenticação gerida via tokens seguros (JWT).
- **RNF-03: Disponibilidade (Check-in)**
  - A geração e visualização do QR Code no aplicativo/site na aba de ingressos deve funcionar mesmo com conexões de internet instáveis (ideal implementar suporte PWA ou cache no dispositivo para garantir que o usuário entre no evento).
- **RNF-04: Usabilidade e Responsividade**
  - A aplicação deve ser "Mobile-First", garantindo que a experiência de compra e apresentação do ingresso via QR Code seja fluida nas telas de smartphones.
- **RNF-05: Escalabilidade (Back-end)**
  - O back-end em Flask deve ser *stateless* para permitir escalabilidade horizontal durante picos de acessos (ex: abertura de vendas de um evento muito aguardado).