import { Player } from './actions/music.action';
import { CommanderScripts, CommandScript } from './commands/index';
import { CommanderEvents } from './events';
import { Client, Collection, GatewayIntentBits } from "discord.js";

export class DiscordClient extends Client {

    private _Player : Player
    private _CommanderScripts: CommanderScripts
    private _CommanderEvents: CommanderEvents
    public commands: Collection<string, CommandScript>

    constructor() {

        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildVoiceStates,
            ]
        })


        this._CommanderEvents = new CommanderEvents(`${__dirname}/events`)
        this._CommanderScripts = new CommanderScripts(`${__dirname}/commands`)
        this.commands = new Collection()
        this._Player = new Player()
    }

    
    public get player(): Player   {
        return this._Player
    }
    

    private async buildClient() {
        (await this._CommanderEvents.listEvents).forEach(event => {
            if (event.once) { this.once((event.name as string), (...args) => event.execute(...args, this)) }
            if (!event.once) { this.on((event.name as string), (...args) => event.execute(...args, this)) }
        });
        (await this._CommanderScripts.listCommands).forEach(command => this.commands.set(command.data.name, { ...command, clientRef: this }))
        // console.log(this.commands);
        console.info('-- Build Client 🕹 --');
    }

    public async init() {
        // await this._CommanderScripts.register()
        await this.buildClient()
        await this.login(process.env.ENV_TOKEN)
        // console.log(this);

    }


}