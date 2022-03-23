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
  name: "rewind",
  description: "rewinds the song",
  options: [
    {
      name: "seconds",
      description: "number of seconds",
      required: true,
      type: "INTEGER",
    },
  ],
  run: async ({ interaction, args }) => {
    try {
      if (!Helper.isUserInVC(interaction)) return;
      let seconds: number = args.data[0].value as number;

      let interactionData: InteractionData = createDataInteraction(interaction);

      await player.rewind(interactionData, seconds);

      return interaction
        .followUp({
          embeds: [
            Embeds.createSimpleEmbed(
              `Rewind: ${seconds} seconds`,
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
              console.log("Failed to delete rewind message");
            }
          }, 5000);
        });
    } catch (error) {
      console.log(`Error: Rewind Command: ${error}`);
      return interaction
        .followUp({
          embeds: [
            Embeds.createSimpleEmbed(`Failed to execute rewind command ❌`, Colors.error),
          ],
        })
        .then((message) => {
          setTimeout(() => {
            try {
              console.log("Message to delete: ", message);
              (message as Message).delete();
            } catch (error) {
              console.log("Failed to delete rewind message.");
            }
          }, 5000);
        });
    }
  },
});
