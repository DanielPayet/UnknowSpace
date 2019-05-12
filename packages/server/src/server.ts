import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as io from 'socket.io';
import Game from './game';
import Player from './player';

const PORT = 3000;

export default class Server {
    private static server: Server = new Server();

    private app: express.Express;
    private httpServer: http.Server;
    public ioServer: io.Server;

    private constructor() {
        this.initApp();
        this.initServers();
        this.initSocketListener();
    }

    public static getServer() {
        return Server.server;
    }

    private initApp(): void {
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.get('/*', (_, res) => {
            res.sendFile(path.join('public', 'index.html'), { root: __dirname });
        });
    }

    private initServers(): void {
        this.httpServer = http.createServer(this.app);
        this.ioServer = io(this.httpServer, { serveClient: false });
    }

    private initSocketListener() {
        this.ioServer.on('connection', (socket) => {
            console.log('A user connected:', socket.id);

            socket.on('setName', (data: { name: string }) => {
                Game.addPlayer(socket.id);
                const player = Game.getPlayer(socket.id);
                player.name = data.name;
                this.addPlayerToGame(socket, player);
                this.initGameForPlayer(socket, Game.players);
            });

            socket.on('disconnect', () => {
                try {
                    console.log('User disconnected', Game.getPlayer(socket.id).name);
                    Game.removePlayer(socket.id);
                } catch (e) {
                    console.error("error on disconnect")
                }
            });
        });
    }

    public startServer() {
        this.httpServer.listen(PORT, () => {
            console.log('Server is live on PORT:', PORT);
        });
    }

    private addPlayerToGame(socket: io.Socket, player: Player) {
        socket.broadcast.emit('newPlayer', { player: player })
    }

    private initGameForPlayer(socket: io.Socket, players: Player[]) {
        socket.emit('initGame', { players: Object.values(players) });
    }
}

