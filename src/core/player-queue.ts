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

    return queuePageFirstIndex;
  }

  displayQueue(): string {
    throw new Error("Method not implemented.");
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
