import { AnyChannel, Channel, Message, MessageReaction, TextChannel } from "discord.js";
import MyClient from "../client/Client";
import Starboard from "./Starboard";

const processEmbed = (message: Message) => {
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
};

const manageStarboard = async (reaction: MessageReaction) => {
    console.log("Managing starboard...");
    const message = reaction.message as Message;
    const client = message.client;
    const starboard = client.channels.cache.find(
        (channel: AnyChannel) =>
            (channel as TextChannel).name.toLowerCase() === "starboard" &&
            (channel as TextChannel).type === "GUILD_TEXT"
    );

    if (starboard && starboard.isText()) {
        const isOnStarboard = starboard.messages.cache.find((msg: Message) =>
            msg.embeds.length === 1 && msg.embeds[0].footer
                ? msg.embeds[0].footer.text.startsWith(reaction.message.id)
                    ? true
                    : false
                : false
        );

        if (isOnStarboard) return;
        const embed = processEmbed(message);

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
    } else throw new Error("Starboard not found!");
};

export default class StarboardManager {
    client: MyClient;
    starboards: Starboard[] | [];

    constructor(client: MyClient) {
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

    async messageReactionAdd(reaction: MessageReaction) {
        if (!reaction) console.error("messageReactionAdd() requires a reaction!")

        if (reaction.emoji.name === "⭐") {
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
                manageStarboard(reaction);
            } catch (err: any) {
                console.error(
                    `Something went wrong when adding a message to a starboard: ${err}`
                );
            }
        }
    }

    messageReactionRemove(reaction: MessageReaction) {
        if (!reaction) console.error("messageReactionRemove() requires a reaction!")
        throw new Error("messageReactionRemove() is unimplemented!")
    }
}
