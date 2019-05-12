# TUTO beauté

Installation

`npm install`

## Dev :
En hot reload tous ça tous ça : 
- serveur : `npm run server:start`
- client : `npm run client:start`

url: http://localhost:3000

## Build pour "prod" 
- serveur: `npm run server:build`
- client: `npm run client:build`
- les deux : `npm build`

Pour lancer l'app builder : `node ./dist/server.js`

url: http://localhost:3000

## Emplacement du code
- serveur: `./packages/server/src`
- client: `./packages/client/src`

## Dépendance importante : 

- Babylon.js - Libre graphique qui déchire
- socket.io - communication server/client
- express - serveur http
