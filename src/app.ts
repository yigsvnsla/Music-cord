console.clear()
import * as dotenv from 'dotenv';
import { DiscordClient } from './client';
dotenv.config()

const _DiscordClient = new DiscordClient()

_DiscordClient.init()

