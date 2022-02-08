import { Queue, Song } from "distube";
import { player } from "../../core/player";
import { PlayerEvent } from "../../structures/event";

export default new PlayerEvent("finishSong", (queue: Queue, song: Song) => {
  try {
    player.updateCurrentSong = song;
  } catch (error) {
    console.log(`Error: finishSong Event: ${error}`);
  }
});
