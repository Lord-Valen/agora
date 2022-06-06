import { Message, MessageReaction, TextChannel } from "discord.js";
import MyClient from "../client/Client";
import StarboardRules from "../types/StarboardRules";
import StarboardManager from "./StarboardManager";

export default class Starboard {
    starboard: TextChannel;
    id: string;
    guildId: string;
    rules: StarboardRules;
    manager: StarboardManager;
    client: MyClient;

    constructor(channel: TextChannel, rules: StarboardRules, manager: StarboardManager) {
        this.starboard = channel;
        this.id = this.starboard.id;
        this.guildId = this.starboard.guildId;
        this.rules = rules;
        this.manager = manager;
        this.client = manager.client;
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

    _isOnStarboard(message: Message): Message<boolean> | undefined {
        return this.starboard.messages.cache.find((msg: Message) =>
            msg.embeds.length === 1 && msg.embeds[0].footer
                ? msg.embeds[0].footer.text.startsWith(message.id)
                    ? true
                    : false
                : false
        );
    }

    async _addMessage(message: Message): Promise<void> {
        console.log(`Adding message to starboard: ${this.id}...`)
        const embed = await this._processEmbed(message);
        await this.starboard
            .send({ embeds: [embed] })
            .catch((err: any) =>
                console.error(
                    `Something went wrong while posting a message: ${err}`
                )
            );
        console.log(`Added message to starboard: ${this.id}!`);
    }

    async _rmMessage(message: Message): Promise<void> {
        console.log(`Removing message from starboard: ${this.id}...`)
        await this.starboard.messages
            .delete(message)
            .catch((err: any) =>
                console.error(
                    `Something went wrong while deleting a message: ${err}`
                )
            );
        console.log(`Removed message from starboard: ${this.id}!`)
    }

    async manageStarboard(reaction: MessageReaction) {
        console.log(`Managing starboard: ${this.id}`);
        const message = reaction.message as Message;
        const messageOnStarboard = this._isOnStarboard(message);

        this.rules.threshold <= reaction.count
            ? messageOnStarboard
                ? console.log("No action needed!")
                : this._addMessage(message)
            : messageOnStarboard
                ? this._rmMessage(messageOnStarboard)
                : console.log("No action needed!")
        console.log(`Finished managing starboard: ${this.id}`)
    }
}
