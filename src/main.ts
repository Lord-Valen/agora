const { token } = require("./config.json");
const { Client, Intents } = require("discord.js");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS],
  partials: ["MESSAGE", "REACTION"],
});

client.on("ready", () => {
  console.log("All set!");
});

client.login(token);

const eventFiles = fs
  .readdisSync("./events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require("./events").filter((file) => file.endsWith(".js"));
  if (event.once) {
    client.once(event.name, (...args: any[]) => event.execute(...args));
  } else {
    client.on(event.name, (...args: any[]) => event.execute(...args));
  }
}
