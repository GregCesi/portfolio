# Étape 1 : Construire l'application Nuxt
FROM node:16 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2 : Servir l'application avec un serveur statique
FROM node:16

WORKDIR /app
COPY --from=builder /app/dist ./
RUN npm install -g serve

CMD ["serve", "-s", ".", "-l", "3000"]
