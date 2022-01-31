import { MessageActionRow } from "discord.js";

export interface PlayerQueue {
  displayQueue(): string;
  queueButtons(): MessageActionRow;
}
