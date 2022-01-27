import { ColorResolvable, MessageEmbed } from "discord.js";

export default class Embeds {
  constructor() {}

  static createSimpleEmbed(message: string, color: string): MessageEmbed {
    return new MessageEmbed()
      .setColor(color as ColorResolvable)
      .setDescription(message);
  }

  static createGifEmbed(
    message: string,
    image: string,
    color: string
  ): MessageEmbed {
    return new MessageEmbed()
      .setDescription(message)
      .setImage(image)
      .setColor(color as ColorResolvable);
  }
}
