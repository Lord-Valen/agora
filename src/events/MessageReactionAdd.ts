import { AnyChannel, Message, MessageReaction, TextChannel } from "discord.js";
import Event from "./Event";

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

class MessageReactionAdd extends Event {
  constructor() {
    super("messageReasctionAdd", false)
  }
  async execute(reaction: MessageReaction): Promise<void> {
    console.log("There was a reaction...");

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
}

export default new MessageReactionAdd()
