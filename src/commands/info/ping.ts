import { Command } from "../../structures/command";

export default new Command({
  name: "ping",
  description: "replies with pong",
  run: async ({ client, interaction }) => {
    interaction.followUp("Pong");
  },
});
