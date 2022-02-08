require("dotenv").config();
import { ExtendedClient } from "./structures/client";

export const client = new ExtendedClient();

client.start();
console.log('Starting...')