import StarboardManager from "./StarboardManager";

export default class Starboard {
    channelId: string;
    guildId: string;
    rules: object;
    manager: StarboardManager;

    constructor(channelId: string, guildId: string, rules: object, manager: StarboardManager) {
        this.channelId = channelId;
        this.guildId = guildId;
        this.rules = rules;
        this.manager = manager;
    }
}
