# Stage 1: Install dependencies
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

# Stage 2: Production image
FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/backend/node_modules ./backend/node_modules
COPY backend/ ./backend/
COPY frontend/ ./frontend/

EXPOSE 3000

CMD [ "node", "backend/server.js" ]
