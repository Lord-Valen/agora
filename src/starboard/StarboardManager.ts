import { Channel, Client, MessageReaction, TextChannel } from "discord.js";
import Starboard from "./Starboard";

export default class StarboardManager {
    client: Client;
    starboards: Starboard[] | [];

    constructor(client: Client) {
        if (!client) throw new Error("StarboardManager requires a client!")
        this.client = client;
        this.starboards = [];
    }

    addBoard(channel: TextChannel, rules: object) {
        if (!channel) throw new Error("StarboardManager requires a channel object to add a board!")
        throw new Error("StarboardManager.addBoard() is unimplemented!")
    }

    rmBoard(id: string) {
        if (!id) throw new Error("StarboardManager requires a channel id to remove a board!")
        throw new Error("StarboardManager.rmBoard() is unimplemented!")
    }

    // Events
    channelDelete(channel: Channel) {
        const matchChannel = this.starboards.find(data => data.channelId === channel.id)
        if (matchChannel) this.rmBoard(channel.id)
    }

    messageReactionAdd(reaction: MessageReaction) {
        if (!reaction) console.error("messageReactionAdd() requires a reaction!")
        throw new Error("messageReactionAdd() is unimplemented!")
    }

    messageReactionRemove(reaction: MessageReaction) {
        if (!reaction) console.error("messageReactionRemove() requires a reaction!")
        throw new Error("messageReactionRemove() is unimplemented!")
    }
}
