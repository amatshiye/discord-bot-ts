import { GuildMember, VoiceBasedChannel } from "discord.js";
import { DisTubeVoiceManager } from "distube";
import Checks from "../../helpers/checks";
import Colors from "../../helpers/colors";
import Embeds from "../../helpers/embeds";
import Gifs from "../../helpers/gifs";
import { Command } from "../../structures/command";
import { player } from "../../structures/player";

export default new Command({
  name: "join",
  description: "Summons bot to a voice channel",
  run: async ({ client, interaction }) => {
    if (!Checks.isUserInVC(interaction)) return;

    try {
      player.joinChannel(interaction.member);
      interaction.followUp({
        embeds: [Embeds.createSimpleEmbed("Joined!", Colors.success)],
      });
    } catch (error) {
      interaction.followUp({
        embeds: [
          Embeds.createSimpleEmbed(
            `An error occured.Failed to join voice channel: ${interaction?.member?.voice?.channel?.id}`,
            Colors.error
          ),
        ],
      });
    }
  },
});
