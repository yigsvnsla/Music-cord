import { DiscordClient } from './../client';
import path from "path";
import { readdir } from "node:fs/promises";
import { REST, Routes, SlashCommandBuilder } from "discord.js";

export interface CommandScript {
    clientRef?: DiscordClient
    data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
    execute(interaction: any | any[]): Promise<void>;

}

export class CommanderScripts {
    public listCommands: Promise<CommandScript[]>;
    private rest: REST;

    /**
     * 
     * @param pathCommandsFolder ruta del folder de scripts para cargalos en la instancia la momento su construccion
     */
    constructor(
        pathCommandsFolder: string
    ) {
        this.rest = new REST({ version: '10' }).setToken((process.env.ENV_TOKEN as string))
        this.listCommands = this.loadCommands(pathCommandsFolder)

    }

    /**
     * funcion privada constructora para cargar la lista de comandos desde un fichero
     *
     * @param pathCommandsFolder ruta del folder con los scripts
     */
    private loadCommands(pathCommandsFolder: string): Promise<CommandScript[]> {
        return new Promise(async (resolve, reject) => {
            try {
                let tempCommandsList = Array.from<CommandScript>({ length: 0 })
                const CommandsPath = path.join(pathCommandsFolder);
                const CommandsFiles = (await readdir(CommandsPath)).filter(file => (file.endsWith('.ts') && (file != 'index.ts')))
                for (const file of CommandsFiles) {
                    const Commandscript = await import(`${CommandsPath}/${file}`);
                    tempCommandsList.push(Commandscript.default)
                }
                resolve(tempCommandsList)
            } catch (error) {
                console.error(error);
                reject(error)
            }
        })
    }

    /**
     * funcion asincronica para registrar comandos a el Bot 
     * * applicationGuildCommands
     */
    public async register() {
        const commands = (await this.listCommands).map(command => command.data);
        await this.rest.put(
            Routes.applicationGuildCommands(`${process.env.ENV_CLIENT}`, `${process.env.ENV_GUILD}`), {
            body: commands
        })
        console.log(`-- Updated Client Scripts --`);
    }


}