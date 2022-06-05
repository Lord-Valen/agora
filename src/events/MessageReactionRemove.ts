import Event from "./Event";

class MessageReactionRemove extends Event {
    constructor() {
        super("messageReactionRemove", false);
    }

    async execute() {
        throw new Error("MessageReactionRemove not yet implemented!")
    }
}

export default new MessageReactionRemove()
