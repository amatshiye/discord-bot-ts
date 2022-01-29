import { GuildMember } from "discord.js";
import { GuildIdResolvable } from "distube";

export interface Player {
  joinChannel(member: GuildMember): void;
  leaveChannel(guild: GuildIdResolvable): boolean;
  play(query: string, member: GuildMember, guild: GuildIdResolvable): void;
  pause(guild: GuildIdResolvable): void;
  resume(guild: GuildIdResolvable): void;
  clear(guild: GuildIdResolvable): Promise<boolean>;
  jump(
    position: number,
    guild: GuildIdResolvable,
    member: GuildMember
  ): Promise<void>;
  move(from: number, to: number): void;
  skip(guild: GuildIdResolvable, member: GuildMember): Promise<boolean>;
  back(guild: GuildIdResolvable, member: GuildMember): Promise<boolean>;
  //forward
  //help
  //loop
  //nowPlaying
  //queue
  //rewind
  //setVolume
  //subboost
  //update
}
