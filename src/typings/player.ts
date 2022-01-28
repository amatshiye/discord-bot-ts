import { GuildMember } from "discord.js";
import { GuildIdResolvable } from "distube";

export interface Player {
  joinChannel(member: GuildMember): void;
  leaveChannel(guild: GuildIdResolvable): boolean;
  play(query: string, member: GuildMember, guild: GuildIdResolvable): void;
  pause(guild: GuildIdResolvable): void;
  resume(guild: GuildIdResolvable): void;
  clear(guild: GuildIdResolvable): Promise<boolean>;
  //jump
  //move
  //skip
  //back
}
