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
    description: `[See the message](${message.url})`,
    fields: [
      {
        name: `${message.author.username} said:`,
        value: message.content,
      },
    ],
    timestamp: message.createdTimestamp.toLocaleString(),
  };
  console.log(`Got the embed!`);

  return embed;
};

const addToStarboard = (message: typeof Message) => {
  console.log("Adding message to starboard...");
  const client = message.client;
  // client.channels.fetch("969686317539655781").then((channel: typeof Channel) => console.log("Fetched channel: " + channel.name)).catch(console.error);
  const starboard = client.channels.cache.find(
    (channel: typeof Channel) =>
      channel.name.toLowerCase() === "starboard" &&
      channel.type === "GUILD_TEXT"
  );
  // const starboard = client.channels.fetch("969686317539655781");

  const embed = processEmbed(message);

  console.log(starboard);
  if (starboard) {
    console.log("Posting embed to starboard...");
    starboard.send({ embeds: [embed] });
    console.log("Posted embed to starboard!");
  } else throw new Error("Starboard not found!");
};

module.exports = {
  name: "messageReactionAdd",
  once: false,
  async execute(reaction: typeof MessageReaction, user: APIUser) {
    console.log("There was a reaction...");
    if (reaction.emoji.name === "⭐") {
      console.log("The reaction is for starboarding!");
      if (reaction.message.channel.name.toLowerCase() === "starboard") {
        console.log("The message is already on the board!");
        return;
      }
      console.log("Fetching...");
      await reaction
        .fetch(false)
        .then((data: typeof MessageReaction) => {
          console.log("Fetched reaction!");
        })
        .catch((err: any) =>
          console.error(`Something went wrong when fetching a reaction: ${err}`)
        );
      await reaction.message
        .fetch(false)
        .then((data: typeof Message) => {
          console.log("Fetched message!");
        })
        .catch((err: any) =>
          console.error(`Something went wrong when fetching a message: ${err}`)
        );

      try {
        addToStarboard(reaction.message);
      } catch (err: any) {
        console.error(
          `Something went wrong when adding a message to a starboard: ${err}`
        );
      }
    }
  },
};
