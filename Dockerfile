# Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install --legacy-peer-deps
COPY client/ ./
RUN npm run build

# Build Backend
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
# Copy built static files from frontend-builder
COPY --from=frontend-builder /app/client/build ./client/build
# Clean up source files that are no longer needed in the final image
RUN rm -rf client/src client/public

EXPOSE 8000

CMD ["npm", "start"]
