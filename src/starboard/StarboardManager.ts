import { Channel, Emoji, Message, MessageReaction, TextChannel } from "discord.js";
import MyClient from "../client/Client";
import StarboardOptions from "../types/StarboardOptions";
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
        return this.starboards.find((data: Starboard) => data.id === id)
    }

    _matchEmoji(emoji: Emoji): Starboard | undefined {
        return this.starboards.find((data: Starboard) => data.rules.emoji === emoji.toString()
        )
    }

    _optionsToRules(rules?: StarboardOptions): StarboardRules {
        const defaultRules = {
            emoji: "⭐",
            threshold: 5,
        }

        if (!rules) return defaultRules
        return {
            emoji: rules.emoji
                ? rules.emoji
                : defaultRules.emoji,
            threshold: rules.threshold
                ? rules.threshold
                : defaultRules.threshold,
        }
    }

    async _fetchReaction(reaction: MessageReaction): Promise<void> {
        await reaction
            .fetch()
            .catch((err: any) =>
                console.error(`Something went wrong when fetching a reaction: ${err}`)
            );
    }

    async _fetchMessage(message: Message): Promise<void> {
        await message
            .fetch(false)
            .catch((err: any) =>
                console.error(`Something went wrong when fetching a message: ${err}`)
            );
    }

    async addBoard(channel: TextChannel, options?: StarboardOptions): Promise<void> {
        if (!channel) throw new Error("StarboardManager requires a channel object to add a board!")
        await channel.fetch();
        await channel.messages.fetch();
        const starboard = new Starboard(channel, this._optionsToRules(options), this);

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

    async manageReaction(reaction: MessageReaction): Promise<void> {
        if (!reaction) throw new Error("manageReaction() requires a reaction!")
        const starboard = this._matchEmoji(reaction.emoji)
        if (!starboard) return;

        console.log("The reaction is for starboarding!");

        console.log("Fetching...");
        await this._fetchReaction(reaction);
        await this._fetchMessage(reaction.message as Message);
        console.log("Fetched!");

        try {
            starboard.manageStarboard(reaction);
        } catch (err: any) {
            console.error(
                `Something went wrong when managing a starboard: ${err}`
            );
        }
    }
}
