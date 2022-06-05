import { Intents } from "discord.js";
import dotenv from "dotenv"
import MyClient from "./client/Client";

dotenv.config();

// Start client
export const client = new MyClient({
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
