import { Queue, Song } from "distube";
import { player } from "../../core/player";
import { PlayerEvent } from "../../structures/event";

export default new PlayerEvent("finishSong", (queue: Queue, song: Song) => {
  try {
    player.updateCurrentSong = song;
    if (player.playlistUpdated) {
      queue.delete();
      player.playlistUpdated = false;
      return;
    }
  } catch (error) {
    console.log(`Error: finishSong Event: ${error}`);
  }
});
