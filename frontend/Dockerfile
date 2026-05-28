# 1. Escolhe uma versão leve do Node.js (versão 20 é a mais recomendada hoje)
FROM node:24-alpine

# 2. Cria uma pasta chamada /app dentro do container do Docker
WORKDIR /app

# 3. Copia apenas os arquivos de configuração das dependências primeiro
COPY package.json package-lock.json ./

# 4. Instala todas as dependências do seu projeto (como React, Tailwind, etc.)
RUN npm install

# 5. Copia o resto dos arquivos do seu projeto para dentro do container
COPY . .

# 6. Avisa que o Next.js vai rodar na porta 3000
EXPOSE 3000

# 7. O comando que o Docker vai rodar automaticamente quando ligar
CMD ["npm", "run", "dev"]