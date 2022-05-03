import { APIReaction, APIUser, APIMessage } from "discord-api-types/v10";
const {
  MessageEmbed,
  Message,
  MessageReaction,
  Channel,
} = require("discord.js");
const { client } = require("../main.js");

const processEmbed = (message: typeof Message) => {
  console.log("Processing embed...");
  const embed = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .addField("URL", message.url)
    .setDescription(message.content)
    .setFooter(message.createdTimestamp.toLocaleString());

  return embed;
};

const addToStarboard = (message: typeof Message) => {
  const starboard = client.channels.cache.find(
    (channel: typeof Channel) => channel.name.toLowerCase() === "starboard"
  );

  const embed = processEmbed(message);

  if (starboard) {
    console.log("Posting embed...");
    starboard.send(embed);
    console.log("Posted")
  }
}

module.exports = {
  name: "messageReactionAdd",
  once: false,
  async execute(reaction: typeof MessageReaction, user: APIUser) {
    console.log("There was a reaction!");
    if (reaction.emoji.name === "⭐") {
      if (reaction.partial === true) {
        console.log("Fetching message...")
        await reaction
          .fetch()
          .then((data: APIMessage) => {
            console.log("Got it!")
            addToStarboard(data);
          })
          .catch((err: string) =>
            console.error(`Something went wrong when fetching a message: ${err}`)
          );
      } else {
        addToStarboard(reaction.message);
      }
    }
  },
};
