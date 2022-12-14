import { CommandScript } from './index';
import { ChatInputCommandInteraction, CommandInteractionOptionResolver, SlashCommandBuilder } from "discord.js";
import { ActionMusic, Player } from "../actions/music.action";


const Action = new ActionMusic();

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

        // (interaction.options as CommandInteractionOptionResolver)

        if ((interaction.options as CommandInteractionOptionResolver)['_hoistedOptions'].length <= 0) {
            // await Action.outParameter(interaction)
            return
        }
        
        this.clientRef?.player.optionsDispatcher(interaction)
        
            
        
        


        // Action.optionsDispatcher(interaction)



    },
};

export default script

