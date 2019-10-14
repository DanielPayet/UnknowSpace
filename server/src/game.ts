import Player from "./player";

export default class Game {
    public static players: Player[] = [];

    private static game: Game = new Game();

    public static getPlayers() {
        return Game.players;
    }

    public static getPlayer(id: any) {
        return Game.players[id];
    }

    public static addPlayer(id: any) {
        Game.players[id] = new Player();
    }

    public static removePlayer(id: any) {
        delete Game.players[id];
    }

    private constructor() { }

    public getInstance() {
        return Game.game;
    }
}
