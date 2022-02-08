import { Message } from "discord.js";
import { queue } from "../../core/player-queue";
import Colors from "../../helpers/colors";
import Embeds from "../../helpers/embeds";
import Helper from "../../helpers/helper";
import { Command } from "../../structures/command";

export default new Command({
  name: "queue",
  description: "Lists the current queue",
  run: async ({ interaction }) => {
    if (!Helper.isUserInVC(interaction)) return;
    try {
      let queueToDisplay: string = queue.displayQueue();

      return interaction
        .followUp({
          embeds: [
            Embeds.createSimpleEmbed(
              `\`\`\`elm${queueToDisplay}\`\`\``,
              Colors.queue
            ),
          ],
          components: [queue.queueButtons()],
        })
        .then((message) => {
          setTimeout(() => {
            try {
              (message as Message).delete();
            } catch (error) {
              console.log(`Error: Queue Command: ${error}`);
            }
          }, 300000);
        });
    } catch (error) {
      return interaction.followUp({
        embeds: [
          Embeds.createSimpleEmbed(
            "⛔ **| Failed to get current queue**",
            Colors.error
          ),
        ],
      });
    }
  },
});
