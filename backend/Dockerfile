FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json ./
RUN npm install

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma
COPY src ./src
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY prisma ./prisma
COPY package.json ./
COPY .env ./
EXPOSE 3000
CMD ["sh", "-c", "npx prisma db push && npx prisma db seed && node dist/main"]
