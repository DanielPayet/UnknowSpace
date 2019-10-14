FROM node:12

WORKDIR /usr/src/app

COPY *.json ./
COPY packages ./packages/
COPY client ./client/
COPY  server ./server/


RUN npm install --unsafe-perm
RUN npm run build
RUN ls
RUN rm -rf node_modules *.json client server

EXPOSE 3000

CMD [ "node", "dist/server.js" ]