import Colors from "../../helpers/colors";
import Embeds from "../../helpers/embeds";
import Helper from "../../helpers/helper";
import { Command } from "../../structures/command";
import { player } from "../../core/player";
import { GuildIdResolvable } from "distube";

export default new Command({
  name: "back",
  description: "Play previous song.",
  run: async ({ interaction }) => {
    if (!Helper.isUserInVC(interaction)) return;

    try {
      if (
        !(await player.back(
          interaction.guild as GuildIdResolvable,
          interaction.member
        ))
      ) {
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
