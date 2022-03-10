import Helper from "../../helpers/helper";
import Colors from "../../helpers/colors";
import Embeds from "../../helpers/embeds";
import { Command } from "../../structures/command";
import { player } from "../../core/player";
import { InteractionData } from "../../typings/interaction-data";
import { GuildIdResolvable } from "distube";

export default new Command({
  name: "join",
  description: "Summons bot to a voice channel",
  run: async ({ interaction }) => {
    if (!Helper.isUserInVC(interaction)) return;

    let interactionData: InteractionData = {
      guild: interaction.guild as GuildIdResolvable,
      textChannel: interaction.channel,
      member: interaction.member,
    };

    try {
      player.joinChannel(interactionData);
      interaction.followUp({
        embeds: [Embeds.createSimpleEmbed("Joined!", Colors.success)],
      });
    } catch (error) {
      interaction.followUp({
        embeds: [
          Embeds.createSimpleEmbed(
            `An error occured. Failed to join voice channel: ${interaction?.member?.voice?.channel?.id}`,
            Colors.error
          ),
        ],
      });
    }
  },
});
