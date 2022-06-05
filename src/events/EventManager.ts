import MyClient from "../client/Client";
import * as fs from "fs";

// Event Handler
export default class EventManager {
    client: MyClient;

    constructor(client: MyClient) {
        this.client = client;
        this.execute();
    }

    execute() {
        fs.readdir(__dirname, (err: any, files: string[]) => {
            if (err) return console.error(err);
            files.forEach(async (file: string) => {
                if (file.endsWith(".js") == false) return;
                if (file == "Event.js") return;
                if (file == "EventManager.js") return;

                console.log(`Requiring ${file}`);
                const eventHandler = await import(`./${file}`);

                if (eventHandler.default.once) {
                    this.client.once(eventHandler.default.name, (...args: any[]) =>
                        eventHandler.default.execute(...args)
                    );
                } else {
                    console.log(`Listening for ${eventHandler.default.name}`);
                    this.client.on(eventHandler.default.name, (...args: any[]) =>
                        eventHandler.default.execute(...args)
                    );
                }
            });
        });
    }
}
