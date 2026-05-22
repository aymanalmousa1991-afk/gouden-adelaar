FROM node:22-slim

WORKDIR /app/server

COPY server/package*.json ./
RUN npm install

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server/index.js"]

