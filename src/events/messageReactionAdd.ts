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
    description: message.content,
    fields: [
      {
        name: "URL",
        value: message.url,
        inline: true,
      },
    ],
    timestamp: message.createdTimestamp.toLocaleString(),
  };

  return embed;
};

const addToStarboard = (message: typeof Message) => {
  const client = message.client;
  // client.channels.fetch("969686317539655781").then((channel: typeof Channel) => console.log("Fetched channel: " + channel.name)).catch(console.error);
  const starboard = client.channels.cache.find(
    (channel: typeof Channel) =>
      channel.name.toLowerCase() === "starboard" &&
      channel.type === "GUILD_TEXT"
  );
  // const starboard = client.channels.fetch("969686317539655781");

  const embed = processEmbed(message);
  console.log(`Got the embed!`);

  console.log(starboard);
  if (starboard) {
    console.log("Posting embed!");
    starboard.send({ embeds: [embed] });
    console.log("Posted embed!");
  } else console.error("Starboard not found");
};

module.exports = {
  name: "messageReactionAdd",
  once: false,
  async execute(reaction: typeof MessageReaction, user: APIUser) {
    console.log("There was a reaction!");
    if (reaction.emoji.name === "⭐") {
      if (reaction.partial === true) {
        console.log("Fetching message...");
        await reaction
          .fetch()
          .then((data: typeof Message) => {
            console.log("Got it!");
            addToStarboard(data);
          })
          .catch((err: string) =>
            console.error(
              `Something went wrong when processing a reaction: ${err}`
            )
          );
      } else {
        addToStarboard(reaction.message);
      }
    }
  },
};
