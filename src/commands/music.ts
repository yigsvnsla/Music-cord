import { CommandScript } from './index';
<<<<<<< HEAD
import { ChatInputCommandInteraction, CommandInteractionOptionResolver, SlashCommandBuilder, VoiceChannel } from "discord.js";
=======
import { ChatInputCommandInteraction, CommandInteractionOptionResolver, SlashCommandBuilder } from "discord.js";
import { ActionMusic } from "../actions/music.action";


const Action = new ActionMusic();
>>>>>>> parent of 7ba51a2 (add bug to Queue)

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

<<<<<<< HEAD
    async execute(interaction: ChatInputCommandInteraction) {        

        if ((interaction.options as CommandInteractionOptionResolver)['_hoistedOptions'].length <= 0) {
            this.clientRef?.player.outParameter(interaction)
             return
        }
    
        this.clientRef?.player.optionsDispatcher(interaction)
    }
=======
    async execute(interaction: ChatInputCommandInteraction) {

        if ((interaction.options as CommandInteractionOptionResolver)['_hoistedOptions'].length <= 0) {
            await Action.outParameter(interaction)
            return
        }
        Action.optionsDispatcher(interaction)



    },
>>>>>>> parent of 7ba51a2 (add bug to Queue)
};

export default script

