FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./
COPY packages ./

RUN npm install
RUN npm build
RUN rm -rf node_module package*.json packages 
COPY dist/* .
RUN rm -rf dist

EXPOSE 3000

CMD [ "node", "server.js" ]