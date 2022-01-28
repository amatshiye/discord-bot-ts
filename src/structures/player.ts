import { GuildMember, VoiceBasedChannel } from "discord.js";
import DisTube, {
  DisTubeOptions,
  DisTubeVoiceManager,
  GuildIdResolvable,
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
  private distube: DisTube;
  private voiceManager: DisTubeVoiceManager;
  private songs: Song[];

  constructor() {
    this.distube = new DisTube(client, distubeOptions);
    this.voiceManager = this.distube.voices;
    this.songs = [];
  }

  joinChannel(member: GuildMember): void {
    this.voiceManager.join(member.voice.channel as VoiceBasedChannel);
  }

  leaveChannel(guild: GuildIdResolvable): boolean {
    if (this.voiceManager.collection.size > 0) {
      this.voiceManager.leave(guild);
      return true;
    }
    return false;
  }

  async play(query: string, member: GuildMember, guild: GuildIdResolvable) {
    let channel: VoiceBasedChannel = member.voice.channel as VoiceBasedChannel;

    await this.distube.play(channel, query);
    const queue: Queue = this.distube.getQueue(guild) as Queue;

    this.songs = Helper.removeDuplicates([...queue.songs] as []);
    queue.songs = this.songs;
  }

  pause(guild: GuildIdResolvable): void {
    const queue: Queue = this.distube.getQueue(guild) as Queue;
    queue?.pause();
  }

  resume(guild: GuildIdResolvable): void {
    const queue: Queue = this.distube.getQueue(guild) as Queue;
    queue.resume();
  }

  async clear(guild: GuildIdResolvable): Promise<boolean> {
    let queue: Queue = this.distube.getQueue(guild) as Queue;

    if (queue) {
      await queue.stop();
      queue.delete();
      this.songs = [];

      return true;
    }
    return false;
  }
}

export const player: ExtendedPlayer = new ExtendedPlayer();
