const fs = require("fs");
const { token } = require("./config.json");
const { Client, Intents, Channel } = require("discord.js");

// Start client
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  partials: ["MESSAGE", "REACTION"],
});

// Login && bootstrap
client.on("ready", async () => {
  console.log("All set!");
});
client.login(token);

// Event Handler
fs.readdir(__dirname + "/events", (err: string, files: string[]) => {
  if (err) return console.error(err);
  files.forEach((file: string) => {
    if (file.endsWith(".js") == false) return;
    const event = require(`./events/${file}`);
    console.log(`Requiring ${file}`);
    if (event.once) {
      client.once(event.name, (...args: any[]) => event.execute(...args));
    } else {
      console.log(`Listening for ${event.name}`);
      client.on(event.name, (...args: any[]) => event.execute(...args));
    }
  });
});
