import {
  ApplicationCommandDataResolvable,
  Client,
  ClientEvents,
  Collection,
} from "discord.js";
import { CommandType } from "../typings/command";
import glob from "glob";
import { promisify } from "util";
import { RegisterCommandsOptions } from "../typings/client";
import { Event, PlayerEvent } from "./event";
import DisTube, { DisTubeEvents, DisTubeOptions } from "distube";

const globPromise = promisify(glob);

const distubeOptions: DisTubeOptions = {
  leaveOnStop: false,
  leaveOnEmpty: false,
  emitNewSongOnly: false,
  leaveOnFinish: false,
  youtubeDL: false,
};

export class ExtendedClient extends Client {
  commands: Collection<string, CommandType> = new Collection();
  public distube: DisTube;

  constructor() {
    super({ intents: 32767 });
    this.distube = new DisTube(this, distubeOptions);
  }

  start() {
    this.registerModules();
    this.login(process.env.botToken);
  }

  private async importFile(filePath: string) {
    return (await import(filePath))?.default;
  }

  async registerCommands({ commands, guildId }: RegisterCommandsOptions) {
    if (guildId) {
      this.guilds.cache.get(guildId)?.commands.set(commands);
      console.log(`Registering commands to: ${guildId}`);
    } else {
      this.application?.commands.set(commands);
      console.log("Registering global commands");
    }
  }

  async registerModules() {
    //Commands
    const slashCommands: ApplicationCommandDataResolvable[] = [];
    const commandFiles = await globPromise(
      `${__dirname}/../commands/*/*{.ts,.js}`
    );

    commandFiles.forEach(async (filePath) => {
      const command: CommandType = await this.importFile(filePath);

      if (!command.name) return;
      console.log(command);
      this.commands.set(command.name, command);
      slashCommands.push(command);
    });

    this.on("ready", () => {
      this.registerCommands({
        commands: slashCommands,
        guildId: process.env.guildId,
      });
    });

    //Event
    const eventFiles = await globPromise(
      `${__dirname}/../events/client-events/*{ts.,js}`
    );
    eventFiles.forEach(async (filePath) => {
      const event: Event<keyof ClientEvents> = await this.importFile(filePath);
      this.on(event.event, event.run);
    });

    //PlayerEvent
    const playerEventFiles = await globPromise(
      `${__dirname}/../events/player-events/*{ts.,js}`
    );
    playerEventFiles.forEach(async (filePath) => {
      const playerEvent: PlayerEvent<keyof DisTubeEvents> =
        await this.importFile(filePath);
      console.log(playerEvent);
      this.distube.on(playerEvent.event, playerEvent.run);
    });
  }
}
