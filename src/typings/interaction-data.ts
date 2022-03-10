import { GuildMember, TextBasedChannel } from "discord.js";
import { GuildIdResolvable } from "distube";

export type InteractionData = {
  guild: GuildIdResolvable;
  member: GuildMember;
  textChannel: TextBasedChannel | null;
};
