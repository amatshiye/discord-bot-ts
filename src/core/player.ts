import { GuildMember, TextBasedChannel, VoiceBasedChannel } from "discord.js";
import DisTube, {
  DisTubeVoiceManager,
  GuildIdResolvable,
  Playlist,
  Queue,
  Song,
} from "distube";
import { client } from "..";
import Helper from "../helpers/helper";
import { Player } from "../typings/player";
import { QueueDeleteReason as QueueDeleteReason } from "../helpers/queue-delete-reason";

class ExtendedPlayer implements Player {
  private _distube: DisTube;
  private _voiceManager: DisTubeVoiceManager;
  private _songs: Song[];
  private _currentSong: Song | null;
  private _previousSong: Song | null;
  private _playlistUpdated: boolean;
  private _currentQuery: string | null;
  private _textChannel: TextBasedChannel | null;
  private _queueDeleteReason: QueueDeleteReason[];

  constructor(distube: DisTube) {
    this._distube = distube;
    this._voiceManager = this._distube.voices;
    this._songs = [];
    this._currentSong = null;
    this._previousSong = null;
    this._playlistUpdated = false;
    this._currentQuery = null;
    this._textChannel = null;
    this._queueDeleteReason = [QueueDeleteReason.none];
  }

  //get current text channel
  get currentTextChannel(): TextBasedChannel | null {
    return this._textChannel;
  }

  //get current query
  get currentQuery(): string | null {
    return this._currentQuery;
  }

  //Getting all songs
  get songs(): Song[] {
    return this._songs;
  }

  //Getting current song
  get currentSong(): Song | null {
    return this._currentSong;
  }

  get previousSong(): Song | null {
    return this._previousSong;
  }

  //Getting current state of [_playlistUpdated]
  get playlistUpdated(): boolean {
    return this._playlistUpdated;
  }

  //Getting queue delete reason
  get queueDeleteReason(): QueueDeleteReason[] {
    return this._queueDeleteReason;
  }

  //Set queue delete reason
  set queueDeleteReason(reason: QueueDeleteReason[]) {
    this.queueDeleteReason.push(...reason);
  }

  //Updating state of [_playlistUpdated]
  set playlistUpdated(state: boolean) {
    this._playlistUpdated = state;
  }

  //Set current playing song
  set updateCurrentSong(song: Song) {
    this._currentSong = song;
  }

  set updatePreviousSong(song: Song) {
    this._previousSong = song;
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
    guild: GuildIdResolvable,
    textChannel?: TextBasedChannel
  ) {
    let channel: VoiceBasedChannel = member.voice.channel as VoiceBasedChannel;
    this._currentQuery = typeof query === "string" ? query : null;
    this._textChannel = typeof textChannel === "undefined" ? null : textChannel;

    await this._distube.play(channel, query);
    const queue: Queue = this._distube.getQueue(guild) as Queue;

    if (this._songs.length < 1) this._currentSong = queue.songs[0];

    if (typeof query === "string") {
      this._songs = Helper.removeDuplicates([...queue.songs] as []);
      queue.songs = [...this._songs];
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

  async clear(guild: GuildIdResolvable): Promise<boolean> {
    try {
      let queue: Queue = this._distube.getQueue(guild) as Queue;

      if (queue) {
        await this.deleteQueue(guild);
      }
      this._queueDeleteReason.push(QueueDeleteReason.clearingQueue);
      this._songs = [];
      this._currentSong = null;
    } catch (error) {
      throw "Failed to clear queue";
    }

    return true;
  }

  //deletes current queue
  private async deleteQueue(guild: GuildIdResolvable): Promise<boolean> {
    let queue: Queue = this._distube.getQueue(guild) as Queue;

    if (queue) {
      queue.delete();
      return true;
    }
    return false;
  }

  //Jumps to a song in queue
  async jump(
    position: number,
    guild: GuildIdResolvable,
    member: GuildMember,
    textChannel?: TextBasedChannel
  ): Promise<void> {
    this._queueDeleteReason.push(QueueDeleteReason.jumpedSongs);

    if (await this.deleteQueue(guild)) {
      let tempSongs: Song[] = [...this._songs];
      tempSongs.splice(0, position);
      this._currentSong = tempSongs[0];

      let playlist: Playlist = new Playlist(tempSongs, { member: member });
      await this.play(playlist, member, guild, textChannel);
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

  //Goes to the next song on queue
  async skip(guild: GuildIdResolvable, member: GuildMember): Promise<boolean> {
    try {
      let queue: Queue = this._distube.getQueue(guild) as Queue;
      await queue.skip();
      return true;
    } catch (error) {
      throw "No queue found";
    }
  }

  //Goes 1 point back in queue
  async back(guild: GuildIdResolvable, member: GuildMember): Promise<boolean> {
    try {
      let queue: Queue = this._distube.getQueue(guild) as Queue;
      await queue.previous();
      return true;
    } catch (error) {
      throw "No queue found";
    }
  }

  //Seek to a position in a song
  private async seek(queue: Queue, seconds: number): Promise<void> {
    if (seconds < 0) {
      await queue.seek(0);
      return;
    }

    await queue.seek(seconds);
  }

  //Go forward in[seonds] a song
  async forward(guild: GuildIdResolvable, seconds: number): Promise<void> {
    let queue: Queue = this._distube.getQueue(guild) as Queue;

    const secondsToSeek: number = queue.currentTime + seconds;
    await this.seek(queue, secondsToSeek);
  }

  //Go back in [seconds] in a song
  async rewind(guild: GuildIdResolvable, seconds: number): Promise<void> {
    let queue: Queue = this._distube.getQueue(guild) as Queue;

    const secondsToSeek: number = queue.currentTime - seconds;
    await this.seek(queue, secondsToSeek);
  }

  //Change player volume
  setVolume(guild: GuildIdResolvable, amount: number): void {
    let queue: Queue = this._distube.getQueue(guild) as Queue;
    if (amount < 0) queue.setVolume(0);
    else if (amount > 100) queue.setVolume(100);
    else queue.setVolume(amount);
  }

  //Turns subboost [on|off]
  subboost(guild: GuildIdResolvable, state: boolean): void {
    let queue: Queue = this._distube.getQueue(guild) as Queue;
    queue.setFilter(state === true ? "subboost" : false);
  }
}

export const player: ExtendedPlayer = new ExtendedPlayer(client.distube);
