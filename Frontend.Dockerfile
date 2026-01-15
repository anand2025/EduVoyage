FROM node:18-alpine

WORKDIR /usr/src/app

COPY client/package*.json ./

RUN npm install --legacy-peer-deps

COPY client/ .

EXPOSE 3000

CMD ["npm", "start"]
