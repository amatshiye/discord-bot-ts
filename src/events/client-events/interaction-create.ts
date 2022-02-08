import { CommandInteractionOptionResolver, Interaction } from "discord.js";
import { client } from "../..";
import { queue } from "../../core/player-queue";
import { Event } from "../../structures/event";
import { ExtendedInteraction } from "../../typings/command";

export default new Event(
  "interactionCreate",
  async (interaction: Interaction) => {
    //Chat input commands
    if (interaction.isCommand()) {
      await interaction.deferReply();
      const command = client.commands.get(interaction.commandName);

      if (!command) return interaction.followUp("WTF!");

      command.run({
        args: interaction.options as CommandInteractionOptionResolver,
        client,
        interaction: interaction as ExtendedInteraction,
      });
    }

    //Button input commands
    if (interaction.isButton()){
      await interaction.deferReply();
      const button: string = interaction.customId;

      queue.queueButtonHandler(interaction, button);
    }
  }
);
