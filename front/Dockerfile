# Dockerfile
FROM node:14 AS builder
COPY . /app
WORKDIR /app

ENV JQ_VERSION=1.5
RUN wget --no-check-certificate https://github.com/stedolan/jq/releases/download/jq-${JQ_VERSION}/jq-linux64 -O /tmp/jq-linux64
RUN cp /tmp/jq-linux64 /usr/bin/jq
RUN chmod +x /usr/bin/jq

WORKDIR /app/src
RUN contents="$(jq '.BASE_URL = "$BASE_URL"' config.json)" && echo ${contents} > config.json

WORKDIR /app
RUN npm install
RUN npm run build

FROM nginx:1.17
COPY ./nginx.conf /etc/nginx/nginx.conf
RUN mkdir -p /code && chown -R 1000:1000 /code
WORKDIR /code

COPY --from=builder --chown=1000:1000 /app/dist .

COPY start_nginx.sh /
RUN chmod +x /start_nginx.sh

EXPOSE 8080
USER 1000

ENTRYPOINT ["/start_nginx.sh"]
