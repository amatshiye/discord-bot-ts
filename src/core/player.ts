import { VoiceBasedChannel } from "discord.js";
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
import { InteractionData } from "../typings/interaction-data";

class ExtendedPlayer implements Player {
  private _distube: DisTube;
  private _voiceManager: DisTubeVoiceManager;
  private _songs: Song[];
  private _previousSong: Song | null;
  private _playlistUpdated: boolean;
  private _currentQuery: string | null;
  private _queueDeleteReason: QueueDeleteReason;
  private _interactionData: InteractionData | null;

  constructor(distube: DisTube) {
    this._distube = distube;
    this._voiceManager = this._distube.voices;
    this._songs = [];
    this._previousSong = null;
    this._playlistUpdated = false;
    this._currentQuery = null;
    this._queueDeleteReason = QueueDeleteReason.none;
    this._interactionData = null;
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
    let queue = this._distube.getQueue(
      this.interactionData?.guild as GuildIdResolvable
    );

    if (queue) return queue.songs[0];
    return null;
  }

  get previousSong(): Song | null {
    return this._previousSong;
  }

  //Getting current state of [_playlistUpdated]
  get playlistUpdated(): boolean {
    return this._playlistUpdated;
  }

  //Getting queue delete reason
  get queueDeleteReason(): QueueDeleteReason {
    return this._queueDeleteReason;
  }

  get interactionData(): InteractionData | null {
    return this._interactionData;
  }

  get distube(): DisTube {
    return this._distube;
  }

  //Set queue delete reason
  set queueDeleteReason(reason: QueueDeleteReason) {
    this.queueDeleteReason = reason;
  }

  //Updating state of [_playlistUpdated]
  set playlistUpdated(state: boolean) {
    this._playlistUpdated = state;
  }

  set updatePreviousSong(song: Song) {
    this._previousSong = song;
  }

  //Bot joins channel
  joinChannel(data: InteractionData): void {
    this._interactionData = data;

    this._voiceManager.join(data.member.voice.channel as VoiceBasedChannel);
  }

  //Bot leave channel
  leaveChannel(data: InteractionData): boolean {
    this._interactionData = data;

    if (this._voiceManager.collection.size > 0) {
      this._voiceManager.leave(data.guild);
      return true;
    }
    return false;
  }

  //Plays a query(link|text) or playlist
  async play(query: string | Playlist, data: InteractionData): Promise<void> {
    try {
      let channel: VoiceBasedChannel = data.member.voice
        .channel as VoiceBasedChannel;
      this._currentQuery = typeof query === "string" ? query : null;
      this._interactionData = data;
      await this._distube.play(channel, query);

      const queue: Queue = this._distube.getQueue(data.guild) as Queue;

      if (typeof query === "string") {
        this._songs = Helper.removeDuplicates([...queue.songs] as []);
        queue.songs = [...this._songs];
      }
      return;
    } catch (error) {
      console.log(`Error: Play(): ErrorDetails: ${error}`);
    }
  }

  //For pausing current song
  pause(data: InteractionData): void {
    const queue: Queue = this._distube.getQueue(data.guild) as Queue;
    this._interactionData = data;

    queue?.pause();
  }

  //Resuming current song
  resume(data: InteractionData): void {
    const queue: Queue = this._distube.getQueue(data.guild) as Queue;
    this._interactionData = data;

    queue.resume();
  }

  async clear(data: InteractionData): Promise<boolean> {
    this._interactionData = data;

    try {
      let queue: Queue = this._distube.getQueue(data.guild) as Queue;

      if (queue) {
        await this.deleteQueue(data.guild);
      }
      this._queueDeleteReason = QueueDeleteReason.clearingQueue;
      this._songs = [];
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
  async jump(position: number, data: InteractionData): Promise<void> {
    this._queueDeleteReason = QueueDeleteReason.jumpedSongs;
    this._interactionData = data;

    if (await this.deleteQueue(data.guild)) {
      let tempSongs: Song[] = [...this._songs];
      tempSongs.splice(0, position);

      let playlist: Playlist = new Playlist(tempSongs, { member: data.member });
      return await this.play(playlist, data);
    } else {
      throw "No queue found!";
    }
  }

  //Moves a song on the queue
  move(from: number, to: number, data: InteractionData): Song {
    this._queueDeleteReason = QueueDeleteReason.movedSongs;
    this._interactionData = data;

    const tempSong: Song = this._songs.splice(from, 1)[0];
    this._songs.splice(to, 0, tempSong);
    this._playlistUpdated = true;

    return tempSong;
  }

  //Goes to the next song on queue
  async skip(data: InteractionData): Promise<boolean> {
    this._interactionData = data;

    try {
      let queue: Queue = this._distube.getQueue(data.guild) as Queue;
      await queue.skip();
      return true;
    } catch (error) {
      throw "No queue found";
    }
  }

  //Goes 1 point back in queue
  async back(data: InteractionData): Promise<boolean> {
    this._interactionData = data;

    try {
      let queue: Queue = this._distube.getQueue(data.guild) as Queue;
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
  async forward(data: InteractionData, seconds: number): Promise<void> {
    let queue: Queue = this._distube.getQueue(data.guild) as Queue;
    this._interactionData = data;

    const secondsToSeek: number = queue.currentTime + seconds;
    await this.seek(queue, secondsToSeek);
  }

  //Go back in [seconds] in a song
  async rewind(data: InteractionData, seconds: number): Promise<void> {
    let queue: Queue = this._distube.getQueue(data.guild) as Queue;
    this._interactionData = data;

    const secondsToSeek: number = queue.currentTime - seconds;
    await this.seek(queue, secondsToSeek);
  }

  //Change player volume
  setVolume(data: InteractionData, amount: number): void {
    let queue: Queue = this._distube.getQueue(data.guild) as Queue;
    this._interactionData = data;

    if (amount < 0) queue.setVolume(0);
    else if (amount > 100) queue.setVolume(100);
    else queue.setVolume(amount);
  }

  //Turns subboost [on|off]
  subboost(data: InteractionData, state: boolean): void {
    let queue: Queue = this._distube.getQueue(data.guild) as Queue;
    this._interactionData = data;

    queue.setFilter(state === true ? "subboost" : false);
  }

  //Updates the playlist [queue.deleted event]
  async updatePlaylist(data: InteractionData): Promise<void> {
    this._queueDeleteReason = QueueDeleteReason.none;

    let currentSongIndex: number = Helper.getCurrentSongIndex(
      player.currentSong,
      [...player.songs]
    );

    if (currentSongIndex < 0) {
      throw "Failed to update playlist";
    }

    let tempSongs: Song[] = [...this._songs];
    tempSongs.splice(0, currentSongIndex + 1);

    let playlist: Playlist = new Playlist(tempSongs, { member: data.member });

    await this.play(playlist, data);
  }
}

export const player: ExtendedPlayer = new ExtendedPlayer(client.distube);
