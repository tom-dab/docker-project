FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

# Copier tous les fichiers nécessaires
COPY server.js .
COPY index.html .
COPY index.js .

EXPOSE 3000

CMD ["node", "server.js"]