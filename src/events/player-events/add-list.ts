import { Playlist, Queue } from "distube";
import { player } from "../../core/player";
import Embeds from "../../helpers/embeds";
import { PlayerEvent } from "../../structures/event";

export default new PlayerEvent(
  "addList",
  async (queue: Queue, playlist: Playlist) => {
    if (playlist.url) {
      try {
        player.currentTextChannel?.send({
          embeds: [await await Embeds.showAddedList(playlist)],
        });
      } catch (error) {
        console.log(`Error: AddList Event: ${error}`);
      }
    }
  }
);
