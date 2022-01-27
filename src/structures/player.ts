import { GuildMember, VoiceBasedChannel } from "discord.js";
import DisTube, {
  DisTubeOptions,
  DisTubeVoiceManager,
  GuildIdResolvable,
  Queue,
} from "distube";
import { client } from "..";
import { Player } from "../typings/player";

const distubeOptions: DisTubeOptions = {
  leaveOnStop: false,
  leaveOnEmpty: false,
};

class ExtendedPlayer implements Player {
  private distube: DisTube;
  private voiceManager: DisTubeVoiceManager;

  constructor() {
    this.distube = new DisTube(client, distubeOptions);
    this.voiceManager = this.distube.voices;
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

  async play(query: string, member: GuildMember) {
    let channel: VoiceBasedChannel = member.voice.channel as VoiceBasedChannel;

    await this.distube.play(channel, query);
  }

  pause(guild: GuildIdResolvable): void {
    const queue: Queue = this.distube.getQueue(guild) as Queue;
    queue?.pause();
  }

  resume(guild: GuildIdResolvable): void {
    const queue: Queue = this.distube.getQueue(guild) as Queue;
    queue.resume();
  }
}

export const player: ExtendedPlayer = new ExtendedPlayer();
