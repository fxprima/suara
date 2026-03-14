FROM node:20-bookworm-slim AS builder
WORKDIR /app

ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock ./
COPY prisma ./prisma

RUN yarn config set network-timeout 600000 -g && yarn install --frozen-lockfile

COPY . .

RUN npx prisma generate --schema=./prisma/schema.prisma
RUN yarn build

FROM node:20-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 8000

CMD ["yarn", "start:prod"]