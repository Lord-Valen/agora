import { Client, Intents } from "discord.js";
import * as fs from "fs";
import dotenv from "dotenv"

dotenv.config();

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
client
  .login(process.env.TOKEN)
  .catch((err: any) =>
    console.error(`Something went wrong while logging in: ${err}`)
  );

// Event Handler
fs.readdir(__dirname + "/events", (err: any, files: string[]) => {
  if (err) return console.error(err);
  files.forEach(async (file: string) => {
    if (file.endsWith(".js") == false) return;

    console.log(`Requiring ${file}`);
    const eventHandler = await import(`./events/${file}`);

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
