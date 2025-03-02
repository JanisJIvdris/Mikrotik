FROM node:18-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm install

COPY . .

RUN npm list dotenv || npm install dotenv

EXPOSE 3000


CMD ["npm", "start"]
