FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

# Remove client folder from backend container if it exists
RUN rm -rf client

EXPOSE 8000

CMD ["npm", "start"]
