import { Client } from "discord.js";
import { Event } from "../structures/event";

export default new Event("ready", (client: Client) => {
    console.log(`${client.user?.username} is online`);
});
