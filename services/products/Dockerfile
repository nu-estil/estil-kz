# syntax = docker/dockerfile:1.2
FROM node:lts-alpine as build

WORKDIR /app

COPY .yarn/ ./.yarn/
COPY .yarnrc.yml package.json yarn.lock ./ 

COPY lib/utils/package.json ./lib/utils/package.json
COPY lib/elastic/package.json ./lib/elastic/package.json
COPY services/products/package.json ./services/products/package.json

RUN yarn workspaces focus @depop/products

COPY tsconfig.common.json .
COPY lib/utils ./lib/utils/
COPY lib/elastic ./lib/elastic/

RUN yarn utils build
RUN yarn elastic build

COPY services/products ./services/products/

RUN yarn products build

CMD ["yarn", "products", "start:js"]