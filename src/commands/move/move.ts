import { Song } from "distube";
import { player } from "../../core/player";
import Colors from "../../helpers/colors";
import Embeds from "../../helpers/embeds";
import { Command } from "../../structures/command";
import {
  createDataInteraction,
  InteractionData,
} from "../../typings/interaction-data";

export default new Command({
  name: "move",
  description: "Move a song on the queue",
  options: [
    {
      name: "from",
      description: "Track number you want to move",
      required: true,
      type: "INTEGER",
    },
    {
      name: "to",
      description: "New track position on the queue",
      required: true,
      type: "INTEGER",
    },
  ],
  run: async ({ interaction, args }) => {
    try {
      let from: number = Number(args.data[0].value) - 1;
      let to: number = Number(args.data[1].value) - 1;

      let interactionData: InteractionData = createDataInteraction(interaction);
      let movedSong: Song = player.move(from, to, interactionData);

      interaction.followUp({
        embeds: [
          Embeds.createSimpleEmbed(
            `Moved: 🎶 \`${movedSong.name}\`  from: \`(${
              from + 1
            })\` ➡ to: \`(${to + 1})\``,
            Colors.success
          ),
        ],
      });
    } catch (error) {
      interaction.followUp({
        embeds: [
          Embeds.createSimpleEmbed("❌ Failed to move songs.", Colors.error),
        ],
      });
      console.log(`Error: Move Command: ${error}`);
    }
  },
});
