import { AnyChannel } from "discord.js";
import MyClient from "../client/Client";
import Event from "./Event";

class Ready extends Event {
    constructor() {
        super("ready", false);
    }

    async execute(client: MyClient) {
        // Test channel
        client.channels.fetch("980686501727830036").then((channel: AnyChannel | null) => {
            if (channel && channel.type === "GUILD_TEXT") client.starboards.addBoard(channel);
            console.log(channel)
            console.log(client.starboards.starboards)
        })

        console.log("All set!");
    }
}

export default new Ready()
