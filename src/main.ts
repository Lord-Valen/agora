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

// Login
client.on("ready", async () => {
  // Make sure starboards are cached
  const starboard = client.channels.cache.find(
    (channel: typeof Channel) =>
      channel.name.toLowerCase() === "starboard" &&
      channel.type === "GUILD_TEXT"
  );

  starboard.messages
    .fetch()
    .then(() =>
      console.log(
        "Fetched starboard messages from: *" +
          starboard.guild.name +
          " #" +
          starboard.name
      )
    )
    .catch((err: any) =>
      console.error(`Something went wrong while fetching a starboard: ${err}`)
    );

  console.log("All set!");
});

client
  .login(token)
  .catch((err: any) =>
    console.error(`Something went wrong while logging in: ${err}`)
  );

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
