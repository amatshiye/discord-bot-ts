import { Queue } from "distube";
import { player } from "../../core/player";
import { QueueDeleteReason } from "../../helpers/queue-delete-reason";
import { PlayerEvent } from "../../structures/event";

export default new PlayerEvent("deleteQueue", async (queue: Queue) => {
  processDeleteReasons();

  player.queueDeleteReason = [QueueDeleteReason.none];
});

function processDeleteReasons(): void {
  player.queueDeleteReason.forEach((reason) => {
    switch (reason) {
      case QueueDeleteReason.movedSongs:
        //Update songs here 
        console.log(`Delete Reason: ${reason}`);
        break;
      case QueueDeleteReason.clearingQueue:
        console.log(`Delete Reason: ${reason}`);
        break;
      case QueueDeleteReason.jumpedSongs:
        console.log(`Delete Reason: ${reason}`);
        break;
      case QueueDeleteReason.none:
        console.log(`Delete Reason: ${reason}`);
        break;
      default:
        console.log(`Delete Reason: ${reason}`);
        break;
    }
    removeReason(reason);
  });
}

function removeReason(reason: QueueDeleteReason) {
  let reasonIndex: number = player.queueDeleteReason.indexOf(reason);

  if (reasonIndex > -1) {
    player.queueDeleteReason.splice(reasonIndex, 1);
  }
}
