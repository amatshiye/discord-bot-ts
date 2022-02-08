import { GuildMember, TextBasedChannel } from "discord.js";
import { GuildIdResolvable, Song } from "distube";

export interface Player {
  get currentTextChannel(): TextBasedChannel | null;
  get currentQuery(): string | null;
  get songs(): Song[];
  get currentSong(): Song | null;
  get previousSong(): Song | null;
  get playlistUpdated(): boolean;
  set playlistUpdated(state: boolean);
  set updateCurrentSong(song: Song);
  set updatePreviousSong(song: Song);
  joinChannel(member: GuildMember): void;
  leaveChannel(guild: GuildIdResolvable): boolean;
  play(
    query: string,
    member: GuildMember,
    guild: GuildIdResolvable,
    textChannel?: TextBasedChannel
  ): void;
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
  forward(guild: GuildIdResolvable, seconds: number): Promise<void>;
  rewind(guild: GuildIdResolvable, seconds: number): Promise<void>;
  setVolume(guild: GuildIdResolvable, amount: number): void;
  subboost(guild: GuildIdResolvable, state: boolean): void;
  //help
  //queue
  //loop
  //update
}
