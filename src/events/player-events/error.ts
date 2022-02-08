import { BaseGuildTextChannel } from "discord.js";
import { PlayerEvent } from "../../structures/event";

export default new PlayerEvent(
  "error",
  (channel: BaseGuildTextChannel, error: Error) => {
    console.log(`Error: Error Event: ${error.message}, Channel: ${channel}`);
  }
);
