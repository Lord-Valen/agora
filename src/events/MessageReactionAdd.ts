import { MessageReaction } from "discord.js";
import { client } from "../main";
import Event from "./Event";

class MessageReactionAdd extends Event {
  constructor() {
    super("messageReactionAdd", false)
  }

  async execute(reaction: MessageReaction): Promise<void> {
    console.log("A reaction was added!");
    try {
      client.starboards.manageReaction(reaction);
    } catch (err: any) {
      console.error(`Something went wrong while managing a reaction: ${err}`);
    }
  }
}

export default new MessageReactionAdd()
