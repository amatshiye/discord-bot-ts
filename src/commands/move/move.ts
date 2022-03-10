import { GuildMember } from "discord.js";
import { GuildIdResolvable } from "distube";
import { type } from "os";
import { Command } from "../../structures/command";
import { InteractionData } from "../../typings/interaction-data";

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
      let from: number = Number(args.data[0].value);
      let to: number = Number(args.data[1].value);

      let interactionData: InteractionData = {
        guild: interaction.guild as GuildIdResolvable,
        textChannel: interaction.channel,
        member: interaction.member,
      };
    } catch (error) {
      console.log(`Error: Move Command: ${error}`);
    }

    interaction.followUp("Move function");
  },
});
