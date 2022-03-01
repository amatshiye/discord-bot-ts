import { Client } from "discord.js";
import { Event } from "../../structures/event";

export default new Event("ready", (client: Client) => {
  try {
    console.log(`${client.user?.username} is online`);
  } catch (error) {
    console.log(`Error: ready Event Error: ${error}`);
  }
});
