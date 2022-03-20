import { GuildMember, TextBasedChannel } from "discord.js";
import { GuildIdResolvable } from "distube";
import { ExtendedInteraction } from "./command";

export type InteractionData = {
  guild: GuildIdResolvable;
  member: GuildMember;
  textChannel: TextBasedChannel | null;
};

export function createDataInteraction(
  interaction: ExtendedInteraction
): InteractionData {
  return <InteractionData>{
    guild: interaction.guild,
    member: interaction.member,
    textChannel: interaction.channel,
  };
}
