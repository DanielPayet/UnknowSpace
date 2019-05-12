import Player from "./player";

export default class Game {
    public static players: Player[] = [];

    private static game: Game = new Game();

    private constructor() { }

    public getInstance() {
        return Game.game;
    }

    static getPlayers() {
        return Game.players;
    }

    static getPlayer(id: any) {
        return Game.players[id];
    }

    static addPlayer(id: any) {
        Game.players[id] = new Player();
    }

    static removePlayer(id: any){
        delete Game.players[id];
    }
}