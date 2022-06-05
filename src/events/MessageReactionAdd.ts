import { MessageReaction } from "discord.js";
import { client } from "../main";
import Event from "./Event";

class MessageReactionAdd extends Event {
  constructor() {
    super("messageReactionAdd", false)
  }

  async execute(reaction: MessageReaction): Promise<void> {
    console.log("There was a reaction...");
    client.starboards.messageReactionAdd(reaction);
  }
}

export default new MessageReactionAdd()
