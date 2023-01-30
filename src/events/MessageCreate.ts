import { Events } from 'discord.js';
import { DiscordClient } from '../client';

export default {
	name: Events.MessageCreate,
	once: true,
	execute(client:any) {
		// console.log(`-- Logged --`, client);
	},
};