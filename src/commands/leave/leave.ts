import Helper from "../../helpers/helper";
import Colors from "../../helpers/colors";
import Embeds from "../../helpers/embeds";
import Gifs from "../../helpers/gifs";
import { Command } from "../../structures/command";
import { player } from "../../core/player";
import {
  createDataInteraction,
  InteractionData,
} from "../../typings/interaction-data";

export default new Command({
  name: "leave",
  description: "You say bye bye",
  run: async ({ client, interaction }) => {
    if (!Helper.isUserInVC(interaction)) return;

    let interactionData: InteractionData = createDataInteraction(interaction);

    try {
      if (player.leaveChannel(interactionData)) {
        return interaction.followUp({
          embeds: [
            Embeds.createGifEmbed(
              "Disconnected!",
              Gifs.kanyeDead,
              Colors.notice
            ),
          ],
        });
      } else {
        return interaction.followUp({
          embeds: [
            Embeds.createGifEmbed(
              "Am I in a channel?",
              Gifs.noBrain,
              Colors.error
            ),
          ],
        });
      }
    } catch (error) {
      return interaction.followUp({
        embeds: [
          Embeds.createSimpleEmbed(
            "I have failed to leave the channel. Get Fucked!",
            Colors.error
          ),
        ],
      });
    }
  },
});
