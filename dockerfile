FROM node:12-alpine
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
RUN mkdir -p /home/node/app/node_modules/log && chown -R node:node /home/node/app
RUN mkdir -p /home/node/app/node_modules/dist && chown -R node:node /home/node/app
RUN mkdir -p /home/node/app/node_modules/static && chown -R node:node /home/node/app

COPY ./dist /home/node/app/dist
COPY ./static /home/node/app/static
COPY ./*.json /home/node/app/

WORKDIR /home/node/app

RUN chmod -R 777 /home/node/app

USER node

RUN npm install

EXPOSE 3000

CMD [ "node", "dist/index.js"]