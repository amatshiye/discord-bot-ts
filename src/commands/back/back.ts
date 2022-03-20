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
  name: "back",
  description: "Play previous song.",
  run: async ({ interaction }) => {
    if (!Helper.isUserInVC(interaction)) return;

    let interactionData: InteractionData = createDataInteraction(interaction);

    try {
      if (!(await player.back(interactionData))) {
        return interaction.followUp({
          embeds: [
            Embeds.createSimpleEmbed(
              `⛔ **| There's no previous song.**`,
              Colors.error
            ),
          ],
        });
      }
      return interaction.followUp({
        embeds: [
          Embeds.createSimpleEmbed(
            `✅ | **It seems we went back in time 🙂**`,
            Colors.success
          ),
        ],
      });
    } catch (error) {
      console.log(`Error: back Command Error: ${error}`);
      interaction.followUp({
        embeds: [
          Embeds.createSimpleEmbed(
            "⛔ **| There's no previous song.**",
            Colors.error
          ),
        ],
      });
    }
  },
});
