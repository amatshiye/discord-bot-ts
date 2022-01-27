require("dotenv").config();
import { DisTubeOptions } from "distube";
import { ExtendedClient } from "./structures/client";

const distubeOptions: DisTubeOptions = {
  leaveOnStop: false,
  leaveOnEmpty: false,
};

export const client = new ExtendedClient();

client.start();
