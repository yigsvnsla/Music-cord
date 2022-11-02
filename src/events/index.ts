import path from "path";
import { readdir } from "node:fs/promises";
import { Events } from 'discord.js'
import { DiscordClient } from "../client";

export interface EventScript {
    once?: boolean,
    on?:boolean
    name: Events;
    execute(interaction?: any | any[], clientRef? : DiscordClient): Promise<void>;
}

export class CommanderEvents {
    public listEvents: Promise<EventScript[]>;

    /**
     * @param pathEventsFolder ruta del folder de scripts para cargalos en la instancia la momento su construccion
     */
    constructor(
        pathEventsFolder: string
    ) {
        this.listEvents = this.loadEvents(pathEventsFolder)
    }

    /**
     * funcion privada constructora para cargar la lista de comandos desde un fichero     *
     * @param pathEventsFolder ruta del folder con los scripts
     */
    private loadEvents(pathEventsFolder: string): Promise<EventScript[]> {
        return new Promise(async (resolve, reject) => {
            try {
                let tempCommandsList = Array.from<EventScript>({ length: 0 })
                const EventsPath = path.join(pathEventsFolder);
                const EventsFiles = (await readdir(EventsPath)).filter(file => (file.endsWith('.ts') && (file != 'index.ts')))
                for (const file of EventsFiles) {
                    const eventScript = await import(`${EventsPath}/${file}`);
                    tempCommandsList.push(eventScript.default)
                }
                resolve(tempCommandsList)
            } catch (error) {
                console.error(error);
                reject(error)
            }
        })
    }
}