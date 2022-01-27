import { ExtendedInteraction } from "../typings/command";
import Colors from "./colors";
import Embeds from "./embeds";
import Gifs from "./gifs";

export default class Checks {
  constructor() {}

  static isUserInVC(interaction: ExtendedInteraction): boolean {
    if (!interaction.member.voice.channel) {
      interaction.followUp({
        embeds: [
          Embeds.createGifEmbed(
            "You must be in a voice channel to use this command",
            Gifs.summonNotInVc,
            Colors.error
          ),
        ],
      });
      return false;
    }
    return true;
  }
}
