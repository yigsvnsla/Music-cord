import { ActionRowBuilder, ButtonBuilder } from 'discord.js';
import { ButtonCreateTypes, ButtonCreator } from './ButtonCreator';

export enum ComponentType {
    playing = 'playing',
    paused = 'paused'
}

export const ComponentTypes = {
    playing: [
        new ButtonCreator(ButtonCreateTypes.prev),
        new ButtonCreator(ButtonCreateTypes.pause),
        new ButtonCreator(ButtonCreateTypes.stop),
        new ButtonCreator(ButtonCreateTypes.next)
    ],
    paused: [
        new ButtonCreator(ButtonCreateTypes.prev),
        new ButtonCreator(ButtonCreateTypes.play),
        new ButtonCreator(ButtonCreateTypes.stop),
        new ButtonCreator(ButtonCreateTypes.next)
    ],
} as const

export class ComponentsCreator extends ActionRowBuilder<ButtonBuilder> {

    constructor(_components: any) {
        super({ components: _components, })
    }

}
