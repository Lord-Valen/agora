import { MessageReaction } from "discord.js";
import { client } from "../main";
import Event from "./Event";

class MessageReactionRemove extends Event {
    constructor() {
        super("messageReactionRemove", false);
    }

    async execute(reaction: MessageReaction) {
        console.log("A reaction was removed!");
        try {
            client.starboards.manageReaction(reaction);
        } catch (err: any) {
            console.error(`Something went wrong while managing a reaction: ${err}`);
        }
    }
}

export default new MessageReactionRemove()
