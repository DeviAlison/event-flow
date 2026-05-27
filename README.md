# EventFlow 🎪

**EventFlow** é uma plataforma ponta a ponta projetada para simplificar a organização de eventos físicos. A aplicação permite gerenciar desde o planejamento inicial e listas de compras colaborativas até o engajamento dos participantes por meio de comentários e reações em tempo real.

Este repositório está estruturado como um **monorepo**, centralizando todas as frentes de desenvolvimento (Front-end, Back-end e Banco de Dados) para facilitar a orquestração local e garantir o paralelismo das tarefas da equipe.

---

## 🏗️ Estrutura do Projeto

O repositório está organizado em três diretórios principais, permitindo que cada stack evolua de forma independente, mas mantendo a consistência em um único ecossistema:


```

```text
File successfully created.

```text
eventflow/
├── backend/                 # API REST em Python + Flask
│
├── frontend/                # Interface do Usuário em React + Next.js
|
├── db/                      # Modelagem de Dados e Scripts Relacionais
└── docker-compose.yml       # Orquestração de containers locais (Docker Engine via WSL)

```

---

## 🛠️ Stack Tecnológica

* **Front-end:** React.js, Next.js, Tailwind CSS
* **Back-end:** Python 3.x, Flask, Flask-CORS, SQLAlchemy
* **Banco de Dados:** MySQL 8.0
* **Ambiente Local:** Docker & Docker Compose rodando nativamente sobre o WSL (Ubuntu)

---

## 🚀 Como Inicializar o Ambiente

Siga as instruções abaixo para rodar o ecossistema completo de forma integrada no seu ambiente de desenvolvimento.

### Pré-requisitos

Certifique-se de possuir instalado em sua distribuição Ubuntu no WSL:

* Docker Engine e Docker Compose (configurados diretamente via terminal, sem necessidade do Docker Desktop)
* Node.js (versão 18 ou superior)
* Python 3.10+

### Passo a Passo

1. **Clonar o Repositório:**
```bash
git clone [https://github.com/DeviAlison/event-flow.git](https://github.com/DeviAlison/event-flow.git)
cd eventflow

```


2. **Subir a Infraestrutura Local (Banco & Back-end):**
Utilizando o Docker Engine no WSL, execute o comando na raiz do projeto para subir os serviços em segundo plano:
```bash
docker compose up -d

```


*Nota: O container do MySQL executará automaticamente o script contido em `db/init.sql` na primeira subida, estruturando todas as tabelas necessárias.*
3. **Executar o Front-end:**
Navegue até a pasta correspondente e inicie o servidor de desenvolvimento do Next.js:
```bash
cd frontend
npm install
npm run dev

```



Com isso, a interface web estará disponível em `http://localhost:3000`, consumindo os endpoints configurados do Flask em `http://localhost:5000`.

---

## 📋 Próximos Passos do Backlog

* [ ] Implementação do mecanismo de autenticação via JWT no Flask.
* [ ] Integração das rotas de criação de eventos com persistência real no MySQL.
* [ ] Criação do painel visual de gerenciamento de itens comprados por usuário.

