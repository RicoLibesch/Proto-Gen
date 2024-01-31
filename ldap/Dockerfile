FROM node:latest
WORKDIR /app
COPY package.json .

RUN npm install

COPY . .
EXPOSE 1389
CMD ["node", "index.js"]