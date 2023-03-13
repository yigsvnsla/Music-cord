import { resolveColor } from 'discord.js';
import { EmbedBuilder, EmbedData } from 'discord.js';

export type EmbedCreatorConfig = Partial<Omit<EmbedData, 'color'>>;
export type EmbedCreatorTypes = 'success' | 'danger' | 'warning' | 'info';

export enum EmbedType {
    success = 'success',
    danger = 'danger',
    warning = 'warning',
    info = 'info'
}

const EmbedCreateType = {
    success: [25, 135, 84],
    danger: [220, 53, 69],
    warning: [255, 193, 7],
    info: [13, 110, 253]
} as const

const EmbedCreateAutor = {
    success: {
        name: 'Music-Cord',
        iconURL: 'https://www.pngitem.com/pimgs/m/225-2259724_check-mark-icon-png-png-download-circle-email.png',
        url: 'https://discord.js.org'
    },
    danger: {
        name: 'Music-Cord',
        iconURL: 'https://as1.ftcdn.net/v2/jpg/01/45/20/02/1000_F_145200273_450ViYipr5uU3WIwqzwjsRDHYTMcUH9P.jpg',
        url: 'https://discord.js.org'
    },
    warning: {
        name: 'Music-Cord',
        iconURL: 'https://www.iconpacks.net/icons/3/free-warning-sign-icon-9771.png',
        url: 'https://discord.js.org'
    },
    info: {
        name: 'Music-Cord',
        iconURL: 'https://www.iconpacks.net/icons/4/free-blue-question-icon-11805.png',
        url: 'https://discord.js.org'
    }
} as const

export class EmbedCreator extends EmbedBuilder {

    constructor(_type: EmbedCreatorTypes, _embedCreatorConfig: EmbedCreatorConfig) {
        super(_embedCreatorConfig)
        this._setType = _type
        this._setAuthor = _type
    }

    public set _setAuthor(_type : EmbedCreatorTypes) {        
        this.setAuthor(EmbedCreateAutor[_type]) ;
    }

    private set _setType(_type: EmbedCreatorTypes) {
        this.setColor(resolveColor(EmbedCreateType[_type]));
    }
};