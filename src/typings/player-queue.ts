import { ButtonInteraction, CacheType, MessageActionRow } from "discord.js";

export interface PlayerQueue {
  displayQueue(): string;
  queueButtons(): MessageActionRow;
  queueButtonHandler(interaction: ButtonInteraction<CacheType>, button: string): void;
}
