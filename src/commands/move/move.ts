import { Command } from "../../structures/command";

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
    interaction.followUp("Move function");
  },
});
