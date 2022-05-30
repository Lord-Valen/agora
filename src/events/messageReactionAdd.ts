import { APIReaction, APIUser, APIMessage } from "discord-api-types/v10";
const {
  MessageEmbed,
  Message,
  MessageReaction,
  Channel,
} = require("discord.js");

const processEmbed = (message: typeof Message) => {
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

const manageStarboard = async (reaction: typeof MessageReaction) => {
  console.log("Managing starboard...");
  const message = reaction.message;
  const client = message.client;
  const starboard = client.channels.cache.find(
    (channel: typeof Channel) =>
      channel.name.toLowerCase() === "starboard" &&
      channel.type === "GUILD_TEXT"
  );

  if (starboard) {
    const isOnStarboard = starboard.messages.cache.find((msg: typeof Message) =>
      msg.embeds.length === 1
        ? msg.embeds[0].footer.text.startsWith(reaction.message.id)
          ? true
          : false
        : false
    );

    if (isOnStarboard) return;
    let embed = processEmbed(message);
    console.log("Posting new message to starboard...");
    await starboard
      .send({
        embeds: [embed],
      })
      .then(console.log("Posted message to starboard!"))
      .catch((err: any) =>
        console.error(
          `Something went wrong while posting a message to a board: ${err}`
        )
      );
  } else throw new Error("Starboard not found!");
};

module.exports = {
  name: "messageReactionAdd",
  once: false,
  async execute(reaction: typeof MessageReaction, user: APIUser) {
    console.log("There was a reaction...");

    if (reaction.emoji.name === "⭐") {
      console.log("The reaction is for starboarding!");

      console.log("Fetching...");
      await reaction
        .fetch(false)
        .then(console.log("Fetched reaction!"))
        .catch((err: any) =>
          console.error(`Something went wrong when fetching a reaction: ${err}`)
        );
      await reaction.message
        .fetch(false)
        .then(console.log("Fetched message!"))
        .catch((err: any) =>
          console.error(`Something went wrong when fetching a message: ${err}`)
        );

      try {
        manageStarboard(reaction);
      } catch (err: any) {
        console.error(
          `Something went wrong when adding a message to a starboard: ${err}`
        );
      }
    }
  },
};
