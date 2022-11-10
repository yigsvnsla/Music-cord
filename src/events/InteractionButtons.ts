import { ButtonInteraction, Events } from "discord.js";

export default {
    name: Events.InteractionCreate,
    async execute(interaction:ButtonInteraction) {
        // try {
        if (!interaction.isButton()) return;
        
        // console.log(interaction);
        console.log('button Interactiom');
        
        
        // const filter = i => i.customId === 'play';
        
        // const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
        
        // collector.on('collect', async i => {
        //     // console.log(interaction);
        //     await i.update({ content: 'A button was clicked!', components: [] });
        // });

        // collector.on('end', collected => console.log(`Collected ${collected.size} items`));
    }
}
