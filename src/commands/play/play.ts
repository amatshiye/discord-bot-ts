import { GuildIdResolvable } from "distube";
import Helper from "../../helpers/helper";
import Colors from "../../helpers/colors";
import Embeds from "../../helpers/embeds";
import { Command } from "../../structures/command";
import { player } from "../../core/player";

export default new Command({
  name: "play",
  description: "Plays a song or playlist",
  options: [
    {
      name: "query",
      description: "The song or playlist you want to play",
      required: true,
      type: "STRING",
    },
  ],
  run: async ({ client, interaction, args }) => {
    if (!Helper.isUserInVC(interaction)) return;

    let query: string = args.data[0].value as string;

    try {
      await player.play(
        query,
        interaction.member,
        interaction.guild as GuildIdResolvable
      );

      return interaction.followUp({
        embeds: [Embeds.createSimpleEmbed("Queue updated! ✅", Colors.success)],
      });
    } catch (error) {
      console.log(error);
      return interaction.followUp({
        embeds: [
          Embeds.createSimpleEmbed(
            "⛔ **An error occured (`Failed to create a queue`), Please check your `query` and try again.**",
            Colors.error
          ),
        ],
      });
    }
  },
});
