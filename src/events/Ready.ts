import { AnyChannel } from "discord.js";
import MyClient from "../client/Client";
import Event from "./Event";

class Ready extends Event {
    constructor() {
        super("ready", false);
    }

    async execute(client: MyClient) {
        // Test channel
        client.channels.fetch("983161541375434862").then((channel: AnyChannel | null) => {
            if (channel && channel.type === "GUILD_TEXT") client.starboards.addBoard(channel, { threshold: 2 });
        })

        console.log("All set!");
    }
}

export default new Ready()
