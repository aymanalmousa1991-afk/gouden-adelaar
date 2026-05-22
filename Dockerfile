FROM node:18-slim

WORKDIR /app

# Kopieer package.json bestanden
COPY package*.json ./
COPY server/package*.json ./server/

# Installeer dependencies
RUN npm install
RUN cd server && npm install

# Kopieer de rest van de bestanden
COPY . .

EXPOSE 3000

CMD ["npm", "start"]

