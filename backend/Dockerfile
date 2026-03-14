FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update \
    && apt-get install -y openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock ./

RUN yarn config set registry https://registry.npmjs.org \
    && yarn config set network-timeout 600000 \
    && yarn install --frozen-lockfile --production=false --network-timeout 600000

COPY prisma ./prisma

RUN npx prisma generate

COPY . .

RUN yarn build

EXPOSE 8000

CMD ["sh", "-c", "npx prisma generate && node dist/main.js"]