import {
  ButtonInteraction,
  CacheType,
  Message,
  MessageActionRow,
  MessageButton,
} from "discord.js";
import { PlayerQueue } from "../typings/player-queue";
import Helper from "../helpers/helper";
import { player } from "./player";
import { Song } from "distube";
import Embeds from "../helpers/embeds";
import Colors from "../helpers/colors";

class ExtendedPlayerQueue implements PlayerQueue {
  private _queuePageFirstIndex: number;

  constructor() {
    this._queuePageFirstIndex = 0;
  }

  private findQueuePageIndex(): number {
    let queuePageFirstIndex: number = 0;
    let currentSongIndex: number = Helper.getCurrentSongIndex(
      player.currentSong,
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

  displayQueue(shouldUpadteQueue: boolean = false): string {
    if (!shouldUpadteQueue)
      this._queuePageFirstIndex = this.findQueuePageIndex();

    const tempSongs: Song[] = [...player.songs].splice(
      this._queuePageFirstIndex > 0
        ? this._queuePageFirstIndex - 1
        : this._queuePageFirstIndex,
      10
    );

    let songNumber: number =
      this._queuePageFirstIndex === 0
        ? this._queuePageFirstIndex + 1
        : this._queuePageFirstIndex;

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

  queueButtonHandler(
    interaction: ButtonInteraction<CacheType>,
    button: string
  ): void {
    switch (button) {
      case "first":
        this._queuePageFirstIndex = 0;
        break;
      case "back":
        this._queuePageFirstIndex -= 11;
        break;
      case "next":
        this._queuePageFirstIndex += 11;
        break;
      case "last":
        this._queuePageFirstIndex = player.songs.length - 10;
        break;
      default:
        console.log("Failed to update queue using buttons.");
        break;
    }
    this._updateQueue(interaction);
  }

  private _updateQueue(interaction: ButtonInteraction<CacheType>): void {
    const message: Message = interaction.message as Message;
    let queueToDisplay: string = this.displayQueue(true);

    message
      .edit({
        embeds: [
          Embeds.createSimpleEmbed(
            `\`\`\`elm${queueToDisplay}\`\`\``,
            Colors.queue
          ),
        ],
      })
      .then((message) => {
        setTimeout(() => {
          try {
            (message as Message).delete();
          } catch (error) {
            console.log(`Error: _updateQueue: ${error}`);
          }
        }, 300000);
      });

    interaction
      .followUp({
        embeds: [
          Embeds.createSimpleEmbed(
            `✅ ${interaction.user.username} used (${interaction.customId})!`,
            Colors.success
          ),
        ],
      })
      .then((message) => {
        setTimeout(() => {
          try {
            (message as Message).delete();
          } catch (error) {
            console.log("Failed to delete queue updated message.");
          }
        }, 2000);
      });
  }
}

export const queue: ExtendedPlayerQueue = new ExtendedPlayerQueue();
