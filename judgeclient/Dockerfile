FROM node:23-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .

RUN npm run build

EXPOSE 3002

CMD ["node", "./dist/server.js"]
