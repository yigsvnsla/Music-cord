import { EmbedDanger, EmbedPrimary, EmbedSuccess, EmbedWarning } from './../tools/embeds-commander';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, CommandInteractionOptionResolver, } from "discord.js";
import { AudioPlayer, AudioPlayerStatus, AudioResource, createAudioPlayer, createAudioResource, joinVoiceChannel, VoiceConnection } from '@discordjs/voice';
import ytSearch, { VideoSearchResult } from "yt-search";
import ytdl from 'ytdl-core';
import { Queue } from '../tools/Queue';

const wait = require('node:timers/promises').setTimeout;

export class Player {

	private queue = new Queue<{ track: ytSearch.VideoSearchResult, resource: AudioResource }>()
	private audioPlayer: AudioPlayer = createAudioPlayer();
	private voiceConnection?: VoiceConnection
	private interactions: any
	constructor() {
		// test error handler
		this.audioPlayer.on("error", error => { console.log(error.message); console.log(this.queue) })
		this.audioPlayer.on(AudioPlayerStatus.Idle, newState => {
			if (!this.queue.isempty()) {
				this.play(this.queue.dequeue())
			}

		});


	}


	/**
	 * Connections
	 */

	private ytFindAudio = async (query: string): Promise<ytSearch.SearchResult> => (await ytSearch(query))

	private async createVoiceConnection(interaction: ChatInputCommandInteraction): Promise<void> {
		if (!interaction.channel?.isVoiceBased()) {
			await interaction.reply({
				embeds: [
					EmbedWarning({
						title: 'Este no es un chat de voz',
						description: '`Este comando solo esta disponible en el chat de los canales de voz`'
					})
				], ephemeral: true,
			})
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
	public async play(findTrack: any) {
		// console.log('play-',findTrack)
		const { track, resource } = findTrack
		const embed = EmbedSuccess({
			url: track.url,
			title: track.title,
			// description: `\`\`\`${track.description}\`\`\``,
			thumbnail: { url: track.thumbnail }
		})

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
		await this.interactions.reply({ embeds: [embed], components: [components] })
		this.audioPlayer.play(resource)
		
	}
	public pause() {
		this.audioPlayer.pause()
	}

	public next() { }

	public prev() { }

	public stop() {
		this.audioPlayer.stop()
	}

	public async add(req: { query: string, priority?: boolean }) {
		if (req.priority) {
			const track = (await this.ytFindAudio(req.query)).videos[0]
			const resource = createAudioResource(ytdl(track.url, { filter: 'audioonly', quality: 'lowestaudio', highWaterMark: 1 << 62, dlChunkSize: 0, liveBuffer: 1 << 62, }));
			this.queue.enqueue({ track, resource })
			console.log('add->',this.queue);

			return track
		}

		if (!req.priority) {
			// TODO: mostrar lista de musica (Embed custom)
		}
	}

	/**
	 * EventsDispatcher
	 */

	public async optionsDispatcher(interaction: ChatInputCommandInteraction) {
		// await interaction.deferReply()
		this.interactions = interaction
		const option = (interaction.options as CommandInteractionOptionResolver)['_hoistedOptions'][0];
		switch (option.name) {
			case 'play':

				if (!this.queue.isempty()) {
					// todo : ( si no esta vacio la cola, intentar reproducir una pista.. caso contrario mandar `Error`)
					await interaction.reply({
						embeds: [
							EmbedWarning({
								title: 'Usar /add para agregar a al lista',
								description: '`siga la lista de opciones preestablecida`'
							})
						], ephemeral: true,
					})
					return
				}

				if (this.queue.isempty()) {
					await this.add({ query: `${option.value}`, priority: true })
					await this.createVoiceConnection(interaction)
					this.voiceConnection?.subscribe(this.audioPlayer);
					const getTrack = this.queue.peek
					this.play(getTrack)
					return
				}

				break;
			case 'add':
				if (this.queue.isfull()) {
					await interaction.reply({
						embeds: [
							EmbedWarning({
								title: 'lista llena',
								description: '`siga la lista de opciones preestablecida`'
							})
						], ephemeral: true,
					})
					return
				}

				if (!this.queue.isfull()) {
					const addTrack = await this.add({ query: `${option.value}`, priority: true })

					// console.log(this.queue.values);

					const embed = EmbedPrimary({
						url: `${addTrack?.url}`,
						title: `${addTrack?.title}`,
						thumbnail: { url: `${addTrack?.thumbnail}` },
						description: '`Agregada pista a la cola 🎶`'
					})
					await interaction.reply({ embeds: [embed], ephemeral: true })
					return
				}

				break;
			case 'remove':

				break;



			// case 'add':

			// break;

			default:
				const embed = EmbedPrimary({
					title: 'Esta no es una opcion valida',
					description: '`siga la lista de opciones preestablecida`'
				})
				await interaction.reply({ embeds: [embed], ephemeral: true })
				break;
		}

	}

	public outParameter = async (interaction: ChatInputCommandInteraction): Promise<void> => {
		const embed = EmbedDanger({
			title: 'Assing a parameters',
			description: '`add one parameter or use command /music help to view menu context`'
		})
		await interaction.reply({ embeds: [embed], ephemeral: true })
	}
}


export class ActionMusic {

	private connection: VoiceConnection | undefined
	private trackList: VideoSearchResult[]
	private trackIndex = 0
	private audioPlayer: AudioPlayer
	constructor() {
		// this.audioPlayer = createAudioPlayer();
		this.connection = undefined
		this.audioPlayer = createAudioPlayer();

		this.trackList = Array.from({ length: 0 })

	}

	private async menuContext(mode: 'play' | 'pause') {
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

	public async findAudio(query: string) {
		const audio = await ytSearch(query);
		return audio.videos[0];
	}

	public async joinVoiceChannel(interaction: ChatInputCommandInteraction) {
		try {
			if (!interaction.channel?.isVoiceBased()) {
				await interaction.reply({
					embeds: [
						EmbedWarning({
							title: 'Este no es un chat de voz',
							description: '`Este comando solo esta disponible en el chat de los canales de voz`'
						})
					], ephemeral: true,
				})
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




	public async playAudio(track: VideoSearchResult) {
		let resource = createAudioResource(ytdl(track.url, { filter: 'audioonly', quality: 'lowestaudio', highWaterMark: 1 << 62, dlChunkSize: 0, liveBuffer: 1 << 62, }));
		this.audioPlayer.play(resource)
		this.connection?.subscribe(this.audioPlayer);

		// test error handler
		this.audioPlayer.on("error", error => console.log(error.message))
		this.audioPlayer.on("stateChange", (oldState, newState) => {
			switch (newState.status) {
				case "idle":
					console.log('dasdas');
					this.connection?.destroy()
					//   this.#nextSong();
					break;
			};
		});
	}





	public async optionsDispatcher(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply()
		const option = (interaction.options as CommandInteractionOptionResolver)['_hoistedOptions'][0];
		switch (option.name) {
			case 'play':
				// if (!this.connection ) { 
				this.joinVoiceChannel(interaction)
				// }
				const track = ((await this.findAudio((option.value as string))) as VideoSearchResult);
				await this.playAudio(track)
				const menu = await this.menuContext('play');

				await interaction.editReply({
					embeds: [
						EmbedSuccess({
							url: track.url,
							title: track.title,
							description: `\`\`\`${track.description}\`\`\``,
							thumbnail: { url: track.thumbnail }
						})
					], components: [menu]
				})
				break;
			case 'add':
				await wait(400);
				await interaction.editReply({
					embeds: [
						EmbedSuccess({
							title: 'cancion mamalona',
							description: '`descripcion de la cancion mamalona`',
							thumbnail: {
								url: 'https://i.imgur.com/AfFp7pu.png'
							}
						})
					], components: [(await this.menuContext('play'))]
				})
				// console.log(option);

				break;
			case 'remove':

				break;

			// case 'add':

			// break;

			// case 'add':

			// break;

			default:
				await interaction.reply({
					embeds: [
						EmbedPrimary({
							title: 'Esta no es una opcion valida',
							description: '`siga la lista de opciones preestablecida`'
						})
					], ephemeral: true,
				})
				break;
		}
	}

	public async outParameter(interaction: ChatInputCommandInteraction): Promise<void> {
		const embed = EmbedDanger({
			title: 'Assing a parameters',
			description: '`add one parameter or use command /music help to view menu context`'
		})
		await interaction.reply({ embeds: [embed], ephemeral: true })
	}
}



