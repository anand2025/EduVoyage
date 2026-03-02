FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add --no-cache python3 make g++ && \
    npm install --legacy-peer-deps --ignore-scripts && \
    apk del python3 make g++

COPY . .

# Remove client folder from backend container if it exists
RUN rm -rf client

EXPOSE 8000

CMD ["npm", "start"]
