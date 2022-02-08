import { Message, TextBasedChannel, TextChannel } from "discord.js";
import { Queue, Song } from "distube";
import { player } from "../../core/player";
import Embeds from "../../helpers/embeds";
import { PlayerEvent } from "../../structures/event";

export default new PlayerEvent("playSong", (queue: Queue, song: Song) => {
  try {
    const textChannel: TextBasedChannel | null = player?.currentTextChannel;
    let songDurationInMilliseconds = song.duration * 1000;

    player.updateCurrentSong = song;
    textChannel
      ?.send({ embeds: [Embeds.currentSongEmbed(song)] })
      .then((message) => {
        setTimeout(() => {
          try {
            (message as Message).delete();
          } catch (error) {
            console.log("Failed to delete queue updated message.");
          }
        }, songDurationInMilliseconds);
      });
  } catch (error) {
    console.log(`Error: playSong Event: ${error}`);
  }
});
