import { CommandScript } from './index';
import { ChatInputCommandInteraction, CommandInteractionOptionResolver, SlashCommandBuilder, VoiceChannel } from "discord.js";

const script: CommandScript = {
    clientRef: undefined,
    data: new SlashCommandBuilder()
        .setName('music')
        .setDescription('Music Player')
        .addStringOption(option =>
            option.setName('play')
                .setDescription('remove songs from queue')
        )
        .addStringOption(option =>
            option.setName('add')
                .setDescription('add songs to queue')
        )
        .addStringOption(option =>
            option.setName('remove')
                .setDescription('remove songs from queue')

        ),

    async execute(interaction: ChatInputCommandInteraction) {        

        if ((interaction.options as CommandInteractionOptionResolver)['_hoistedOptions'].length <= 0) {
            (this.clientRef as any).player.outParameter(interaction)
             return
        }
    
        (this.clientRef as any).player.optionsDispatcher(interaction)
    }
};

export default script

