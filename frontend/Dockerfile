FROM node:20-bookworm-slim

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn config set registry https://registry.npmjs.org \
    && yarn config set network-timeout 600000 \
    && yarn install --frozen-lockfile --production=false --network-timeout 600000

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start", "-p", "3000"]