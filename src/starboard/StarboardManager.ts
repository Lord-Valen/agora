import { Channel, Emoji, MessageReaction, TextChannel } from "discord.js";
import MyClient from "../client/Client";
import StarboardRules from "../types/StarboardRules";
import Starboard from "./Starboard";

export default class StarboardManager {
    client: MyClient;
    starboards: Starboard[];

    constructor(client: MyClient) {
        if (!client) throw new Error("StarboardManager requires a client!")
        this.client = client;
        this.starboards = [];
    }

    _matchId(id: string): Starboard | undefined {
        return this.starboards.find((data: Starboard) => data.channelId === id)
    }

    _matchEmoji(emoji: Emoji): Starboard | undefined {
        return this.starboards.find((data: Starboard) => data.rules.emoji === emoji.toString()
        )
    }

    _rules(rules?: StarboardRules): StarboardRules {
        const defaultRules = {
            emoji: "⭐",
            threshold: 5,
        }

        if (!rules) return defaultRules
        return {
            emoji: rules.emoji ? rules.emoji : defaultRules.emoji,
            threshold: rules.threshold ? rules.threshold : defaultRules.threshold,
        }
    }

    addBoard(channel: TextChannel, rules?: StarboardRules): void {
        if (!channel) throw new Error("StarboardManager requires a channel object to add a board!")
        const starboard = new Starboard(channel.id, channel.guildId, this._rules(rules), this);

        this.starboards.push(starboard);
    }

    rmBoard(id: string): void {
        if (!id) throw new Error("StarboardManager requires a channel id to remove a board!")
        throw new Error("StarboardManager.rmBoard() is unimplemented!")
    }

    // Events
    channelDelete(channel: Channel): void {
        if (this._matchId(channel.id)) this.rmBoard(channel.id)
    }

    async messageReactionAdd(reaction: MessageReaction): Promise<void> {
        if (!reaction) throw new Error("messageReactionAdd() requires a reaction!")
        const starboard = this._matchEmoji(reaction.emoji)
        if (!starboard) throw new Error("Emoji does not match!")

        console.log("The reaction is for starboarding!");

        console.log("Fetching...");
        await reaction
            .fetch()
            .catch((err: any) =>
                console.error(`Something went wrong when fetching a reaction: ${err}`)
            );

        await reaction.message
            .fetch(false)
            .catch((err: any) =>
                console.error(`Something went wrong when fetching a message: ${err}`)
            );
        console.log("Fetched!");

        try {
            starboard.messageReactionAdd(reaction);
        } catch (err: any) {
            console.error(
                `Something went wrong when adding a message to a starboard: ${err}`
            );
        }
    }

    messageReactionRemove(reaction: MessageReaction) {
        if (!reaction) console.error("messageReactionRemove() requires a reaction!")
        throw new Error("messageReactionRemove() is unimplemented!")
    }
}
