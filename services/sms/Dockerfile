# syntax = docker/dockerfile:1.2
FROM node:lts-alpine as build

WORKDIR /app

COPY .yarn/ ./.yarn/
COPY .yarnrc.yml package.json yarn.lock ./ 

COPY lib/utils/package.json ./lib/utils/package.json
COPY services/sms/package.json ./services/sms/package.json

RUN yarn workspaces focus @depop/sms

COPY tsconfig.common.json .

COPY lib/utils ./lib/utils/
RUN yarn utils build

COPY services/sms ./services/sms/

RUN yarn sms build

CMD ["yarn", "sms", "start:js"]