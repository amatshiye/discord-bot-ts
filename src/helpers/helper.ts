import { Song } from "distube";
import { ExtendedInteraction } from "../typings/command";
import Colors from "./colors";
import Embeds from "./embeds";
import Gifs from "./gifs";

export default class Helper {
  constructor() {}

  static isUserInVC(interaction: ExtendedInteraction): boolean {
    if (!interaction.member.voice.channel) {
      interaction.followUp({
        embeds: [
          Embeds.createGifEmbed(
            "You must be in a voice channel to use this command",
            Gifs.summonNotInVc,
            Colors.error
          ),
        ],
      });
      return false;
    }
    return true;
  }

  static removeDuplicates(array: []): Song[] {
    return [
      ...array
        .reduce((map, song: Song) => map.set(song.id, song), new Map())
        .values(),
    ];
  }

  static getCurrentSongIndex(currentSong: Song | null, songs: Song[]): number {
    try {
      const currentSongIndex: number = songs.findIndex((_song) => {
        return _song?.id === currentSong?.id;
      });

      return currentSongIndex;
    } catch (error) {
      console.log(`Error: getCurrentSongIndex: ${error}`);
      return -1;
    }
  }
}
