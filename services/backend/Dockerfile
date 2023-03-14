# syntax = docker/dockerfile:1.2
FROM node:lts-alpine as build

WORKDIR /app

COPY .yarn/ ./.yarn/
COPY .yarnrc.yml package.json yarn.lock ./ 

COPY lib/utils/package.json ./lib/utils/package.json
COPY lib/minio/package.json ./lib/minio/package.json
COPY services/backend/package.json ./services/backend/package.json

RUN yarn workspaces focus @depop/backend

COPY tsconfig.common.json .

COPY lib/utils ./lib/utils/
COPY lib/minio ./lib/minio/

RUN yarn utils build
RUN yarn minio build

COPY services/backend ./services/backend/
RUN yarn backend build

CMD ["yarn", "backend", "start:js"]