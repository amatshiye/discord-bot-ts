import { Message, TextBasedChannel } from "discord.js";
import { Queue, Song } from "distube";
import { player } from "../../core/player";
import Embeds from "../../helpers/embeds";
import { PlayerEvent } from "../../structures/event";

export default new PlayerEvent("playSong", async (queue: Queue, song: Song) => {
  try {
    const textChannel: TextBasedChannel | null | undefined =
      player.interactionData?.textChannel;
    let songDurationInMilliseconds = song.duration * 1000;

    player.updateCurrentSong = song;
    return textChannel
      ?.send({ embeds: [Embeds.currentSongEmbed(song)] })
      .then((message) => {
        try {
          setTimeout(() => {
            try {
              console.log("Message to delete: ", message);
              (message as Message).delete();
            } catch (error) {
              console.log("Failed to delete queue updated message.");
            }
          }, songDurationInMilliseconds);
        } catch (error) {
          console.log(`Error: playSong Event: setTimeout(): ${error}`);
        }
      });
  } catch (error) {
    console.log(`Error: playSong Event: ${error}`);
  }
});
