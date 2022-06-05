import { Message, MessageReaction } from "discord.js";
import StarboardRules from "../types/StarboardRules";
import StarboardManager from "./StarboardManager";

export default class Starboard {
    channelId: string;
    guildId: string;
    rules: StarboardRules;
    manager: StarboardManager;

    constructor(channelId: string, guildId: string, rules: StarboardRules, manager: StarboardManager) {
        this.channelId = channelId;
        this.guildId = guildId;
        this.rules = rules;
        this.manager = manager;
    }

    async _processEmbed(message: Message) {
        console.log("Processing embed...");
        const embed = {
            author: {
                name: message.author.username,
                icon_url: message.author.displayAvatarURL(),
            },
            description: `[See this message](${message.url})`,
            fields: [
                {
                    name: `${message.author.username} said:`,
                    value: message.content,
                },
            ],
            timestamp: new Date(message.createdTimestamp),
            footer: {
                text: message.id,
            },
        };

        console.log(`Got the embed!`);

        return embed;
    }

    async messageReactionAdd(reaction: MessageReaction) {
        console.log(`Managing starboard: ${this.channelId}`);
        const message = reaction.message as Message;
        const starboard = await this.manager.client.channels.fetch(this.channelId);

        if (!starboard) throw new Error(`Could not fetch board! Starboard not found!`);
        if (!starboard.isText()) throw new Error(`${starboard.name} is not a text channel!`);

        const isOnStarboard = starboard.messages.cache.find((msg: Message) =>
            msg.embeds.length === 1 && msg.embeds[0].footer
                ? msg.embeds[0].footer.text.startsWith(reaction.message.id)
                    ? true
                    : false
                : false
        );

        if (isOnStarboard) return;
        const embed = await this._processEmbed(message);

        console.log("Posting new message to starboard...");
        await starboard
            .send({
                embeds: [embed],
            })
            .catch((err: any) =>
                console.error(
                    `Something went wrong while posting a message to a board: ${err}`
                )
            );
        console.log("Posted message to starboard!");
    }

    async messageReactionRemove(reaction: MessageReaction) {
        throw new Error("messageReactionRemove() is unimplemented!")
    }
}
