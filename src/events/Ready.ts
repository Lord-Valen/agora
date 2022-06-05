import { AnyChannel, Client, TextChannel } from "discord.js";
import Event from "./Event";

class Ready extends Event {
    constructor() {
        super("ready", false);
    }

    async execute(client: Client) {
        // Ensure starboards are cached
        const starboard = client.channels.cache.find(
            (channel: AnyChannel) =>
                (channel as TextChannel).name.toLowerCase() === "starboard" &&
                (channel as TextChannel).type === "GUILD_TEXT"
        );

        try {
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
    }
}

export default new Ready()
