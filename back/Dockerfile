FROM node:14
RUN mkdir -p /app && chown -R node:node /app
WORKDIR /app
USER node

RUN mkdir tmp
RUN mkdir assets

COPY ./package*.json /app/
RUN npm install

COPY --chown=node:node *.js /app/
COPY --chown=node:node assets/* /app/assets/
COPY --chown=node:node tmp /app/

CMD ["node", "/app"]
