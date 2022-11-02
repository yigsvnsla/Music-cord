import { DiscordClient } from './../client';
import { ChatInputCommandInteraction, Events } from 'discord.js';

export default {
	name: Events.InteractionCreate,
	async execute(interaction:ChatInputCommandInteraction, clientRef:DiscordClient ) {		
		try {
            if (!interaction.isChatInputCommand()) return;            
            const _command = clientRef.commands.get(interaction.commandName)
            if (!_command)  throw new Error(`No command matching "${interaction.commandName}" was found.`);
            await _command.execute(interaction);
		} catch (error) {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			console.error(`Error executing ${interaction.commandName}: `,error);
		}
	},
};