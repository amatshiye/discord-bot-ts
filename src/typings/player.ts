import { Song } from "distube";
import { InteractionData } from "./interaction-data";

export interface Player {
  get currentQuery(): string | null;
  get songs(): Song[];
  get currentSong(): Song | null;
  get previousSong(): Song | null;
  get playlistUpdated(): boolean;
  get interactionData(): InteractionData | null;
  set playlistUpdated(state: boolean);
  set updatePreviousSong(song: Song);

  joinChannel(data: InteractionData): void;
  leaveChannel(data: InteractionData): boolean;
  play(query: string, data: InteractionData): Promise<void>;
  pause(data: InteractionData): void;
  resume(data: InteractionData): void;
  clear(data: InteractionData): Promise<boolean>;
  jump(position: number, data: InteractionData): Promise<void>;
  move(from: number, to: number, data: InteractionData): Song;
  skip(data: InteractionData): Promise<boolean>;
  back(data: InteractionData): Promise<boolean>;
  forward(data: InteractionData, seconds: number): Promise<void>;
  rewind(data: InteractionData, seconds: number): Promise<void>;
  setVolume(data: InteractionData, amount: number): void;
  subboost(data: InteractionData, state: boolean): void;
  updatePlaylist(data: InteractionData): void;
  //help
  //queue
  //loop
  //update
}
