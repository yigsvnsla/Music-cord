import { EmbedDanger, EmbedPrimary, EmbedSuccess, EmbedWarning } from './../tools/embeds-commander';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, ClientUser, CommandInteractionOption, CommandInteractionOptionResolver, EmbedAssetData, EmbedBuilder, TextChannel } from "discord.js";
import { AudioPlayer, createAudioPlayer, createAudioResource, joinVoiceChannel, VoiceConnection } from '@discordjs/voice';
import ytSearch, { VideoSearchResult } from "yt-search";
import ytdl from 'ytdl-core';

const wait = require('node:timers/promises').setTimeout;

export class ActionMusic {

	private connection : VoiceConnection | undefined
	private trackList: VideoSearchResult[]
	private audioPlayer : AudioPlayer
    constructor() {
		this.audioPlayer = createAudioPlayer();
		this.connection = undefined
		this.trackList = Array.from({length:0})

    }

	private async menuContext(mode: 'play' | 'pause'){
		let rowComponents = new ActionRowBuilder<ButtonBuilder>()
		switch (mode) {
			case 'play':
				rowComponents.addComponents([
					new ButtonBuilder()
						.setCustomId('back')
						.setLabel('back')
						.setStyle(ButtonStyle.Secondary)
						.setEmoji('⏮'),
					new ButtonBuilder()
						.setCustomId('pause')
						.setLabel('pause')
						.setStyle(ButtonStyle.Success)
						.setEmoji('⏸'),
					new ButtonBuilder()
						.setCustomId('stop')
						.setLabel('stop')
						.setStyle(ButtonStyle.Danger)
						.setEmoji('⏹'),
					new ButtonBuilder()
						.setCustomId('next')
						.setLabel('next')
						.setStyle(ButtonStyle.Secondary)
						.setEmoji('⏭'),
				]);
				break;
			case 'pause':
				rowComponents.addComponents([
					new ButtonBuilder()
						.setCustomId('back')
						.setLabel('back')
						.setStyle(ButtonStyle.Secondary)
						.setEmoji('⏮'),
					new ButtonBuilder()
						.setCustomId('play')
						.setLabel('play')
						.setStyle(ButtonStyle.Success)
						.setEmoji('▶'),
					new ButtonBuilder()
						.setCustomId('stop')
						.setLabel('stop')
						.setStyle(ButtonStyle.Danger)
						.setEmoji('⏹'),
					new ButtonBuilder()
						.setCustomId('next')
						.setLabel('next')
						.setStyle(ButtonStyle.Secondary)
						.setEmoji('⏭'),
				]);
				break;
			default:
				break;
		}
		return rowComponents
	}

	public async playAudio(track:VideoSearchResult){
		// if (!this.trackList[0]) return;		
		let resourse = createAudioResource(ytdl(track.url, { filter: 'audioonly'}));     
		this.audioPlayer.play(resourse);
		this.connection?.subscribe(this.audioPlayer);
	
		this.audioPlayer.on("stateChange", (oldState, newState) =>{
		  switch (newState.status){
			case "idle":
				console.log('dasdas');
				
			//   this.#nextSong();
			  break;
		  };
		});
	}

	public async findAudio(query:string){
		return await ytSearch(query)
	}

	public async joinVoiceChannel(interaction:ChatInputCommandInteraction){
		try {
			if (!interaction.channel?.isVoiceBased()){
				await interaction.reply({ embeds: [
					EmbedWarning({
						title:'Este no es un chat de voz',
						description:'`Este comando solo esta disponible en el chat de los canales de voz`'
					})
				], ephemeral:true,})
				return false
			}

			this.connection = joinVoiceChannel({
				channelId: interaction.channel.id,
				guildId: interaction.channel.guild.id,
				adapterCreator: interaction.channel.guild.voiceAdapterCreator,
			});

			return true
		} catch (error) {
			
			return false
		}
	}

	public async optionsDispatcher (interaction:ChatInputCommandInteraction){
		await interaction.deferReply()
		const option = (interaction.options as CommandInteractionOptionResolver)['_hoistedOptions'][0];
		switch (option.name) {
			case 'play':
				if (!this.connection ) { this.joinVoiceChannel(interaction)	}
				const track = ((await this.findAudio((option.value as string))).all[0] as VideoSearchResult);
				await this.playAudio(track)
				const menu = await this.menuContext('play');
				
				await interaction.editReply({
					embeds:[
						EmbedSuccess({
							url:track.url,
							title:track.title,
							description:`\`\`\`${track.description}\`\`\``,
							thumbnail:{ url:track.thumbnail }
						})
					], components:[	menu ]
				})
			break;
			case 'add':
				await wait(400);
				await interaction.editReply({
					embeds:[
						EmbedSuccess({
							title:'cancion mamalona',
							description:'`descripcion de la cancion mamalona`',
							thumbnail:{
								url:'https://i.imgur.com/AfFp7pu.png'
							}
						})
					], components:[	(await this.menuContext('play')) ]
				})
				console.log(option);
				
			break;
			case 'remove':
				
			break;
		
			// case 'add':
				
			// break;
		
			// case 'add':
				
			// break;
					
			default:
				await interaction.reply({ embeds: [
					EmbedPrimary({
						title:'Esta no es una opcion valida',
						description:'`siga la lista de opciones preestablecida`'
					})
				], ephemeral:true,})
			break;
		}
	}

	public async outParameter(interaction:ChatInputCommandInteraction) : Promise<void> {
		const embed = EmbedDanger({
			title:'Assing a parameters',
			description:'`add one parameter or use command /music help to view menu context`'
		})
		await interaction.reply({ embeds: [embed], ephemeral:true })
	}
}