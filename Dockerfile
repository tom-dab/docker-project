# Partir d'une image de base Node.js légère
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de dépendances dans le conteneur
COPY package*.json ./

# Installer les dépendances de production
RUN npm install --production

# Copier le reste des fichiers de l'application dans le conteneur
COPY server.js .

# Exposer le port sur lequel l'application va écouter
EXPOSE 3000

# Démarrer l'application
CMD ["node", "server.js"]