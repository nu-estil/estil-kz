# syntax = docker/dockerfile:1.2
FROM node:lts-alpine as build

WORKDIR /app

COPY .yarn/ ./.yarn/
COPY .yarnrc.yml package.json yarn.lock ./ 

COPY lib/utils/package.json ./lib/utils/package.json
COPY services/queue/package.json ./services/queue/package.json

RUN yarn workspaces focus @depop/queue

COPY tsconfig.common.json .

COPY lib/utils ./lib/utils/
RUN yarn utils build

COPY services/queue ./services/queue/

RUN yarn queue build

CMD ["yarn", "queue", "start:js"]