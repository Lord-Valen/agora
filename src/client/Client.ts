import { Client, ClientOptions } from "discord.js";
import StarboardManager from "../starboard/StarboardManager";

export default class MyClient extends Client {
    starboards: StarboardManager;

    constructor(options: ClientOptions) {
        super(options);
        this.starboards = new StarboardManager(this);
    }
}
