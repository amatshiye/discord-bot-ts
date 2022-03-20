import Colors from "../../helpers/colors";
import Embeds from "../../helpers/embeds";
import Helper from "../../helpers/helper";
import { Command } from "../../structures/command";
import { player } from "../../core/player";
import {
  createDataInteraction,
  InteractionData,
} from "../../typings/interaction-data";

export default new Command({
  name: "skip",
  description: "Plays next song in the queue",
  run: async ({ interaction }) => {
    if (!Helper.isUserInVC(interaction)) return;

    let interactionData: InteractionData = createDataInteraction(interaction);

    try {
      if (!(await player.skip(interactionData))) {
        return interaction.followUp({
          embeds: [
            Embeds.createSimpleEmbed(
              `⛔ **| You're at the end of the queue.**`,
              Colors.error
            ),
          ],
        });
      }

      return interaction.followUp({
        embeds: [
          Embeds.createSimpleEmbed(
            `✅ | Skipped **${player.currentSong?.name}**`,
            Colors.success
          ),
        ],
      });
    } catch (error) {
      console.log(`Error: skip Command Error: ${error}`);
      return interaction.followUp({
        embeds: [
          Embeds.createSimpleEmbed(
            "An error occured. Failed to skip song.",
            Colors.error
          ),
        ],
      });
    }
  },
});
