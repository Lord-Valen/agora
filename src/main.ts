import { AnyChannel, Client, Intents, TextChannel } from "discord.js";
import * as fs from "fs";
import dotenv from "dotenv"

dotenv.config();
console.log(process.env.TOKEN)

// Start client
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  partials: ["MESSAGE", "REACTION"],
});

// Login
client.on("ready", async () => {
  // Make sure starboards are cached
  const starboard = client.channels.cache.find(
    (channel: AnyChannel) =>
      (channel as TextChannel).name.toLowerCase() === "starboard" &&
      (channel as TextChannel).type === "GUILD_TEXT"
  );

  try {
    console.log(starboard);
    if (!starboard)
      throw new Error(
        "Could not fetch board: ${starboard.name}! starboard not found!"
      );
    if (starboard.isText()) {
      starboard.messages
        .fetch()
        .then(() =>
          console.log(
            `Fetched starboard messages from: *${(starboard as TextChannel).guild.name
            } #${(starboard as TextChannel).name}`
          )
        )
        .catch((err: any) =>
          console.error(
            `Something went wrong while fetching a starboard: ${err}`
          )
        );
    } else throw new Error(`${starboard.name} is not a text channel!`);
  } catch (err: any) {
    console.error(`Something went wrong while fetching a board: ${err}`);
    return;
  }

  console.log("All set!");
});

client
  .login(process.env.TOKEN)
  .catch((err: any) =>
    console.error(`Something went wrong while logging in: ${err}`)
  );

// Event Handler
fs.readdir(__dirname + "/events", (err: any, files: string[]) => {
  if (err) return console.error(err);
  files.forEach((file: string) => {
    if (file.endsWith(".js") == false) return;

    console.log(`Requiring ${file}`);
    const eventHandler = require(`./events/${file}`);

    if (eventHandler.once) {
      client.once(eventHandler.name, (...args: any[]) =>
        eventHandler.execute(...args)
      );
    } else {
      console.log(`Listening for ${eventHandler.name}`);
      client.on(eventHandler.name, (...args: any[]) =>
        eventHandler.execute(...args)
      );
    }
  });
});
