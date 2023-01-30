import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, CommandInteractionOptionResolver, EmbedBuilder, EmbedData, resolveColor, } from "discord.js";
import { AudioPlayer, AudioPlayerStatus, AudioResource, createAudioPlayer, createAudioResource, joinVoiceChannel, VoiceConnection } from '@discordjs/voice';
import ytSearch, { VideoSearchResult } from "yt-search";
import ytdl from 'ytdl-core';
import { Queue } from '../tools/Queue';
import { EmbedCreator, EmbedType } from '../tools/EmbedCreator';

const wait = require('node:timers/promises').setTimeout;
export class Player {

	private queue = new Queue<{ track: ytSearch.VideoSearchResult, resource: AudioResource }>()
	private audioPlayer: AudioPlayer = createAudioPlayer();
	private voiceConnection?: VoiceConnection
	private interactions?: ChatInputCommandInteraction

	constructor() {
		// test error handler
		this.audioPlayer.on("error", error => { console.log(error.message); console.log(this.queue) })

		this.audioPlayer.on(AudioPlayerStatus.Idle, async newState => {
			if (!this.queue.isempty()) {
				let peek = this.queue.peek
				// const embed = EmbedSuccess({
				// 	url: `${peek.track?.url}`,
				// 	title: `${peek.track?.title}`,
				// 	// description: `\`\`\`${track.description}\`\`\``,
				// 	thumbnail: { url: `${peek.track?.thumbnail}` }
				// })
				// await this.interactions?.editReply({ embeds: [embed], components:[] })
				this.queue.dequeue()
				let newPeek = this.queue.peek

				// const newEmbed = EmbedSuccess({
				// 	url: `${newPeek.track?.url}`,
				// 	title: `${newPeek.track?.title}`,
				// 	// description: `\`\`\`${track.description}\`\`\``,
				// 	thumbnail: { url: `${newPeek.track?.thumbnail}` }
				// })

				const components = new ActionRowBuilder<ButtonBuilder>()
					.addComponents([
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

				// await this.interactions?.followUp({ embeds: [newEmbed], components:[components] })


				this.play()
			}
		});


	}


	/**
	 * Connections
	 */

	private ytFindAudio = async (query: string): Promise<ytSearch.SearchResult> => (await ytSearch(query))

	private async createVoiceConnection(interaction: ChatInputCommandInteraction): Promise<void> {
		if (!interaction.channel?.isVoiceBased()) {
			// await interaction.reply({
			// 	embeds: [
			// 		EmbedWarning({
			// 			title: 'Este no es un chat de voz',
			// 			description: '`Este comando solo esta disponible en el chat de los canales de voz`'
			// 		})
			// 	], ephemeral: true,
			// })
			return
		}

		this.voiceConnection = joinVoiceChannel({
			channelId: interaction.channel.id,
			guildId: interaction.channel.guild.id,
			adapterCreator: interaction.channel.guild.voiceAdapterCreator,
		});
	}

	/**
	 * Actions Player
	 */
	public async play() {
		// const { track, resource } = this.queue.peek
		// this.audioPlayer.play(resource)
		// const embed = EmbedSuccess({
		// 	url: `${track?.url}`,
		// 	title: `${track?.title}`,
		// 	// description: `\`\`\`${track.description}\`\`\``,
		// 	thumbnail: { url: `${track?.thumbnail}` }
		// })


		// await this.interactions?.reply({
		// 	embeds: [
		// 		new EmbedCreator(EmbedType.danger, {
		// 			title: 'Esta no es una opcion valida',
		// 			description: '`siga la lista de opciones preestablecida`'
		// 		})
		// 	]
		// })
	}
	public pause() {
		this.audioPlayer.pause()
	}

	public next() { }

	public prev() { }

	public stop() {
		this.audioPlayer.stop()
	}

	public async add(query: string,) {
		const track = (await this.ytFindAudio(query)).videos[0]
		const resource = createAudioResource(ytdl(track.url, { filter: 'audioonly', quality: 'lowestaudio', highWaterMark: 1 << 62, dlChunkSize: 0, liveBuffer: 1 << 62, }));
		this.queue.enqueue({ track, resource })
		// console.log('add->',this.queue);
		// if (!req.priority) {
		// 	// TODO: mostrar lista de musica (Embed custom)
		// }
	}

	/**
	 * EventsDispatcher
	 */

	public async optionsDispatcher(interaction: ChatInputCommandInteraction) {
		this.interactions = interaction
		const option = (interaction.options as CommandInteractionOptionResolver)['_hoistedOptions'][0];
		switch (option.name) {
			case 'play':
				// console.log(this.interactions.channel?.messages.cache.get());
				await this.add(`${option.value}`)
				if (this.queue.isempty()) {
					// si la cola esta vacia agregamos una cancion.

					// await this.createVoiceConnection(interaction)
					// this.voiceConnection?.subscribe(this.audioPlayer);


					// this.play()
				}



				// if (!this.queue.isempty()) {
				// 	// todo : ( si no esta vacio la cola, intentar reproducir una pista.. caso contrario mandar `Error`)
				// 	// await interaction.reply({
				// 	// 	// embeds: [
				// 	// 	// 	EmbedWarning({
				// 	// 	// 		title: 'Usar /add para agregar a al lista',
				// 	// 	// 		description: '`siga la lista de opciones preestablecida`'
				// 	// 	// 	})
				// 	// 	// ], ephemeral: true,
				// 	// })
				// 	return
				// }

				// if (this.queue.isempty()) {
				// 	// const track = await this.add({ query: `${option.value}`, priority: true })
				// 	// await this.createVoiceConnection(interaction)
				// 	// this.voiceConnection?.subscribe(this.audioPlayer);

				// 	// const embed = EmbedSuccess({
				// 	// 	url: `${track?.url}`,
				// 	// 	title: `${track?.title}`,
				// 	// 	// description: `\`\`\`${track.description}\`\`\``,
				// 	// 	thumbnail: { url: `${track?.thumbnail}` }
				// 	// })

				// 	// const components = new ActionRowBuilder<ButtonBuilder>()
				// 	// 	.addComponents([
				// 	// 		new ButtonBuilder()
				// 	// 			.setCustomId('back')
				// 	// 			.setLabel('back')
				// 	// 			.setStyle(ButtonStyle.Secondary)
				// 	// 			.setEmoji('⏮'),
				// 	// 		new ButtonBuilder()
				// 	// 			.setCustomId('pause')
				// 	// 			.setLabel('pause')
				// 	// 			.setStyle(ButtonStyle.Success)
				// 	// 			.setEmoji('⏸'),
				// 	// 		new ButtonBuilder()
				// 	// 			.setCustomId('stop')
				// 	// 			.setLabel('stop')
				// 	// 			.setStyle(ButtonStyle.Danger)
				// 	// 			.setEmoji('⏹'),
				// 	// 		new ButtonBuilder()
				// 	// 			.setCustomId('next')
				// 	// 			.setLabel('next')
				// 	// 			.setStyle(ButtonStyle.Secondary)
				// 	// 			.setEmoji('⏭'),
				// 	// 	]);
				// 	this.play()
				// 	// await this.interactions?.reply({ embeds: [embed], components: [components] })

				// 	return
				// }

				break;
			case 'add':
				// if (this.queue.isfull()) {
				// 	// await interaction.reply({
				// 	// 	embeds: [
				// 	// 		EmbedWarning({
				// 	// 			title: 'lista llena',
				// 	// 			description: '`siga la lista de opciones preestablecida`'
				// 	// 		})
				// 	// 	], ephemeral: true,
				// 	// })
				// 	return
				// }

				// if (!this.queue.isfull()) {
				// 	const addTrack = await this.add({ query: `${option.value}`, priority: true })
				// 	const embed = EmbedPrimary({
				// 		url: `${addTrack?.url}`,
				// 		title: `${addTrack?.title}`,
				// 		thumbnail: { url: `${addTrack?.thumbnail}` },
				// 		description: '`Agregada pista a la cola 🎶`'
				// 	})
				// 	await interaction.reply({ embeds: [embed] })
				// 	return
				// }

				break;
			case 'remove':

				break;



			// case 'add':

			// break;

			default:
				this.outParameter(this.interactions)
				break;
		}

	}

	public async outParameter(interaction: ChatInputCommandInteraction): Promise<void> {
		const responseReply = await interaction.reply({
			fetchReply: false,
			ephemeral: true,
			embeds: [
				new EmbedCreator(EmbedType.danger, {
					title: 'Esta no es una opcion valida',
					description: '`siga la lista de opciones preestablecida`'
				}),
			]
		})	
		console.log(responseReply.interaction.channel?.id)
		console.log(this.interactions?.guild?.channels.fetch(''+responseReply.interaction.channel?.id))
		
		// console.log(this.interactions?.channel?.messages.cache.get(`${responseReply.id}`) )
		
	}
}





