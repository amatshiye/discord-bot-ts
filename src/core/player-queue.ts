import { MessageActionRow, MessageButton } from "discord.js";
import { PlayerQueue } from "../typings/player-queue";
import Helper from "../helpers/helper";
import { player } from "./player";
import { Song } from "distube";

export default class ExtendedPlayerQueue implements PlayerQueue {
  constructor() {}

  private findQueuePageIndex(): number {
    let queuePageFirstIndex: number = 0;
    let currentSongIndex: number = Helper.getCurrentSongIndex(
      player.currentSong as Song,
      [...player.songs]
    );

    for (let i = currentSongIndex; i > 0; i--) {
      if (Number.isInteger(i / 10)) {
        queuePageFirstIndex = i + 1;
        break;
      }
    }

    if (queuePageFirstIndex < 0) {
      return 0;
    } else if (queuePageFirstIndex > player.songs.length) {
      return player.songs.length;
    } else return queuePageFirstIndex;
  }

  displayQueue(): string {
    let queuePageFirstIndex: number = this.findQueuePageIndex();
    const tempSongs: Song[] = [...player.songs].splice(
      queuePageFirstIndex > 0 ? queuePageFirstIndex - 1 : queuePageFirstIndex
    );

    let songNumber: number =
      queuePageFirstIndex === 0 ? queuePageFirstIndex + 1 : queuePageFirstIndex;

    const songsToDisplay: string[] = tempSongs.map((_song) => {
      const playEmoji: string = _song.id === player.currentSong?.id ? "🎶" : "";
      const element = `${songNumber}) ${_song.name} - [${_song.formattedDuration}] ${playEmoji}\n`;
      songNumber++;

      return element;
    });

    let queueToDisplay: string = "\n";
    for (let i = 0; i < songsToDisplay.length; i++) {
      queueToDisplay += songsToDisplay[i];
    }

    if (songNumber - 1 === player.songs.length) {
      queueToDisplay += "\n⬅End of Queue➡";
    }

    return queueToDisplay;
  }

  queueButtons(): MessageActionRow {
    return new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("first")
        .setLabel("First")
        .setStyle("SECONDARY"),
      new MessageButton()
        .setCustomId("back")
        .setLabel("Back")
        .setStyle("SECONDARY"),
      new MessageButton()
        .setCustomId("next")
        .setLabel("Next")
        .setStyle("SECONDARY"),
      new MessageButton()
        .setCustomId("last")
        .setLabel("Last")
        .setStyle("SECONDARY")
    );
  }
}
