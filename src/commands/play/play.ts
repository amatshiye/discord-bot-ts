import { GuildIdResolvable } from "distube";
import Helper from "../../helpers/helper";
import Colors from "../../helpers/colors";
import Embeds from "../../helpers/embeds";
import { Command } from "../../structures/command";
import { player } from "../../core/player";
import { Message, TextBasedChannel } from "discord.js";

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
  run: async ({ interaction, args }) => {
    if (!Helper.isUserInVC(interaction)) return;

    let query: string = args.data[0].value as string;
    let textChannel: TextBasedChannel | undefined =
      interaction.channel != null ? interaction.channel : undefined;

    try {
      await player.play(
        query,
        interaction.member,
        interaction.guild as GuildIdResolvable,
        textChannel
      );

      return interaction
        .followUp({
          embeds: [
            Embeds.createSimpleEmbed("Queue updated! ✅", Colors.success),
          ],
        })
        .then((message) => {
          setTimeout(() => {
            try {
              (message as Message).delete();
            } catch (error) {
              console.log(`Error: Play Command: ${error}`);
            }
          }, 2000);
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
