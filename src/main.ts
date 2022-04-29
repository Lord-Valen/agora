const fs = require("fs");
const { token } = require("./config.json");
const { Client, Intents } = require("discord.js");

// Start client
const client = new Client({
  intents: [Intents.FLAGS.GUILDS],
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

// Login
client.on("ready", () => {
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

module.exports = client;
