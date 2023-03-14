# syntax = docker/dockerfile:1.2
FROM node:lts-alpine as build

WORKDIR /app

COPY .yarn/ ./.yarn/
COPY .yarnrc.yml package.json yarn.lock ./ 

COPY lib/utils/package.json ./lib/utils/package.json
COPY services/worker/package.json ./services/worker/package.json

RUN yarn workspaces focus @depop/worker

COPY tsconfig.common.json .

COPY lib/utils ./lib/utils/
RUN yarn utils build

COPY services/worker ./services/worker/

RUN yarn worker build

CMD ["yarn", "worker", "start:js"]