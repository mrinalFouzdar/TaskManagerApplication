FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build || echo "Build handled by ts-node directly"

EXPOSE 5000

CMD ["npm", "start"]
