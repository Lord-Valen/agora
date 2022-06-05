import { Client, ClientOptions } from "discord.js";
import EventManager from "../events/EventManager";
import StarboardManager from "../starboard/StarboardManager";

export default class MyClient extends Client {
    starboards: StarboardManager;
    events: EventManager;

    constructor(options: ClientOptions) {
        super(options);
        this.starboards = new StarboardManager(this);
        this.events = new EventManager(this);
    }
}
