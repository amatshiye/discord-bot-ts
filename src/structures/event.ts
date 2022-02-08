import { Awaitable, ClientEvents } from "discord.js";
import { DisTubeEvents } from "distube";

export class Event<Key extends keyof ClientEvents> {
  constructor(
    public event: Key,
    public run: (...args: ClientEvents[Key]) => any
  ) {}
}

export class PlayerEvent<Key extends keyof DisTubeEvents> {
  constructor(
    public event: Key,
    public run: (...args: any[]) => Awaitable<any>
  ) {}
}
