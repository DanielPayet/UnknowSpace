import * as socketio from 'socket.io-client';

/**
 * Permet la connexion server
 */
export default class Socket {
    public socket = socketio("http://localhost:3000");
    constructor() {
        this.socket.emit("setName", { name: "dadou" });
        this.socket.on('initGame', (data) => {
            // console.log(data);
        });
        this.socket.on('newPlayer', (data) => {
            // console.log(data.player);
        });
    }
}
