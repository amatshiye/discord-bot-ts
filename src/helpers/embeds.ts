import { ColorResolvable, MessageEmbed } from "discord.js";
import { Playlist, Song } from "distube";
import { YouTube } from "youtube-sr";
import Colors from "./colors";
import Gifs from "./gifs";

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

  static async showAddedList(playlist: Playlist): Promise<MessageEmbed> {
    const playlistInfo: any = await YouTube.getPlaylist(
      playlist?.url as string
    );
    let lastUpdate =
      playlistInfo.lastUpdate != null
        ? playlistInfo.lastUpdate
        : "No recent update";

    return new MessageEmbed()
      .setColor(Colors.notice as ColorResolvable)
      .setTitle("Playlist Details 🎧")
      .addField("`Name: `", `[${playlistInfo.title}](${playlist.url})`)
      .addField("`Queue: `", `${playlist.songs.length} songs`, true)
      .addField("`Views: `", `${playlistInfo.views} views`, true)
      .addField("`Last Updated: `", `${lastUpdate}`, true)
      .addField("`Channel Name: `", `${playlistInfo.channel.name}`, true)
      .addField(
        "`Channel Link: `",
        `[Youtube Link](${playlistInfo.channel.url})`,
        true
      )
      .addField("\u200B", "\u200B", true);
  }

  static currentSongEmbed(song: Song): MessageEmbed {
    return new MessageEmbed()
      .setColor(Colors.notice as ColorResolvable)
      .setTitle("Now Playing")
      .setDescription(`[${song.name}](${song.url})`)
      .setThumbnail(
        song.thumbnail != undefined ? song.thumbnail : Gifs.kanyeDead
      );
  }
}
