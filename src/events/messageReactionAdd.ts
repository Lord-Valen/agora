import { APIReaction, APIUser, APIMessage } from "discord-api-types/v10";
const {
  MessageEmbed,
  Message,
  MessageReaction,
  Channel,
} = require("discord.js");
const { client } = require("../main.js");

const processEmbed = (message: typeof Message) => {
  console.log("Processing embed");
  const embed = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setURL(message.url)
    .setDescription(message.content)
    .setFooter(message.createdTimestamp.toLocaleString());

  const starboard = client.channels.cache.find(
    (channel: typeof Channel) => channel.name.toLowerCase() === "starboard"
  );

  if (starboard) {
    console.log("Posting embed");
    starboard.send(embed);
  }
};

module.exports = {
  name: "messageReactionAdd",
  once: false,
  async execute(reaction: typeof MessageReaction, user: APIUser) {
    console.log("There was a reaction!");
    if (reaction.message.emoji === "⭐") {
      if (reaction.partial == true) {
        await reaction
          .fetch()
          .then((data: APIMessage) => {
            processEmbed(data);
          })
          .catch((err: string) =>
            console.log(`Something went wrong when fetching a message: ${err}`)
          );
      } else {
        processEmbed(reaction.message);
      }
    }
  },
};
