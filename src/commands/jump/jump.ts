import { Message } from "discord.js";
import { player } from "../../core/player";
import Colors from "../../helpers/colors";
import Embeds from "../../helpers/embeds";
import Helper from "../../helpers/helper";
import { Command } from "../../structures/command";
import {
  createDataInteraction,
  InteractionData,
} from "../../typings/interaction-data";

export default new Command({
  name: "jump",
  description: "Jumps to the specified track number",
  options: [
    {
      name: "track",
      description: "Track number you want to jump to.",
      required: true,
      type: "INTEGER",
    },
  ],
  run: async ({ interaction, args }) => {
    try {
      if (!Helper.isUserInVC(interaction)) return;

      let option: string = args.data[0].value as string;
      let trackNumber: number = Number(option) - 1;
      let interactionData: InteractionData = createDataInteraction(interaction);

      await player.jump(trackNumber, interactionData);
      interaction
        .followUp({
          embeds: [
            Embeds.createSimpleEmbed(
              `Jumped to ${player.songs[trackNumber].name} ✅`,
              Colors.success
            ),
          ],
        })
        .then((message) => {
          setTimeout(() => {
            try {
              console.log("Message to delete: ", message);
              (message as Message).delete();
            } catch (error) {
              console.log("Failed to delete queue updated message.");
            }
          }, 10000);
        });
    } catch (error) {
      console.log(`Error: Jump Command: ${error}`);
      return interaction
        .followUp({
          embeds: [
            Embeds.createSimpleEmbed(
              "Failed to execute jump command ❌",
              Colors.error
            ),
          ],
        })
        .then((message) => {
          setTimeout(() => {
            try {
              console.log("Message to delete: ", message);
              (message as Message).delete();
            } catch (error) {
              console.log("Failed to delete queue updated message.");
            }
          }, 10000);
        });
    }
  },
});
