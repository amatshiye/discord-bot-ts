import { Queue } from "distube";
import { player } from "../../core/player";
import { QueueDeleteReason } from "../../helpers/queue-delete-reason";
import { PlayerEvent } from "../../structures/event";
import { InteractionData } from "../../typings/interaction-data";

export default new PlayerEvent("deleteQueue", async (queue: Queue) => {
  if (player.queueDeleteReason === QueueDeleteReason.movedSongs) {
    console.log(`Delete Reason: ${player.queueDeleteReason}`);
    return await player.updatePlaylist(
      player?.interactionData as InteractionData
    );
  }
});
