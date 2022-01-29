import { GuildMember, VoiceBasedChannel } from "discord.js";
import DisTube, {
  DisTubeOptions,
  DisTubeVoiceManager,
  GuildIdResolvable,
  Playlist,
  Queue,
  Song,
} from "distube";
import { client } from "..";
import Helper from "../helpers/helper";
import { Player } from "../typings/player";

const distubeOptions: DisTubeOptions = {
  leaveOnStop: false,
  leaveOnEmpty: false,
};

class ExtendedPlayer implements Player {
  private _distube: DisTube;
  private _voiceManager: DisTubeVoiceManager;
  private _songs: Song[];
  private _currentSong: Song | null;
  private _playlistUpdated: boolean;

  constructor() {
    this._distube = new DisTube(client, distubeOptions);
    this._voiceManager = this._distube.voices;
    this._songs = [];
    this._currentSong = null;
    this._playlistUpdated = false;
  }

  get songs(): Song[] {
    return this._songs;
  }

  get currentSong(): Song | null {
    return this._currentSong;
  }

  get playlistUpdated(): boolean {
    return this._playlistUpdated;
  }

  set playlistUpdated(state: boolean) {
    this._playlistUpdated = state;
  }

  //Bot joins channel
  joinChannel(member: GuildMember): void {
    this._voiceManager.join(member.voice.channel as VoiceBasedChannel);
  }

  //Bot leave channel
  leaveChannel(guild: GuildIdResolvable): boolean {
    if (this._voiceManager.collection.size > 0) {
      this._voiceManager.leave(guild);
      return true;
    }
    return false;
  }

  //Plays a query(link|text) or playlist
  async play(
    query: string | Playlist,
    member: GuildMember,
    guild: GuildIdResolvable
  ) {
    let channel: VoiceBasedChannel = member.voice.channel as VoiceBasedChannel;

    await this._distube.play(channel, query);
    const queue: Queue = this._distube.getQueue(guild) as Queue;

    if (typeof query === "string") {
      this._songs = Helper.removeDuplicates([...queue.songs] as []);
      queue.songs = this._songs;
    }
  }

  //For pausing current song
  pause(guild: GuildIdResolvable): void {
    const queue: Queue = this._distube.getQueue(guild) as Queue;
    queue?.pause();
  }

  //Resuming current song
  resume(guild: GuildIdResolvable): void {
    const queue: Queue = this._distube.getQueue(guild) as Queue;
    queue.resume();
  }

  //Clears the queue
  async clear(guild: GuildIdResolvable): Promise<boolean> {
    let queue: Queue = this._distube.getQueue(guild) as Queue;

    if (queue) {
      await queue.stop();
      queue.delete();
      this._songs = [];

      return true;
    }
    return false;
  }

  //Jumps to a song in queue
  async jump(
    position: number,
    guild: GuildIdResolvable,
    member: GuildMember
  ): Promise<void> {
    if (await this.clear(guild)) {
      let tempSongs: Song[] = [...this._songs];
      tempSongs.splice(0, position);
      this._currentSong = tempSongs[0];

      let playlist: Playlist = new Playlist(tempSongs, { member: member });
      await this.play(playlist, member, guild);
    } else {
      throw "No queue found!";
    }
  }

  //Moves a song on the queue
  move(from: number, to: number): void {
    const tempSong: Song = this._songs.splice(from, 1)[0];
    this._songs.splice(to, 0, tempSong);
    this._playlistUpdated = true;
  }
}

export const player: ExtendedPlayer = new ExtendedPlayer();
