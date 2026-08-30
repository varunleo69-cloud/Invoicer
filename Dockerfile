FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

# Ensure both src and public are copied
COPY src/ ./src/
COPY public/ ./public/

EXPOSE 3000

CMD ["node", "src/server.js"]
