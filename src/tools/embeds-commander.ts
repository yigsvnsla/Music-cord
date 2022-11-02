import { ClientUser, resolveColor } from 'discord.js';
import { EmbedBuilder, EmbedData } from 'discord.js';

type EmbedOptions = Omit<EmbedData, 'color' | 'author'>

export const EmbedWarning = (embedOptions: EmbedOptions) => {
    return new EmbedBuilder({
        ...embedOptions,
        color: resolveColor([255, 205, 0]),
        author: {
            name: 'Music-Cord',
            iconURL: 'https://www.iconpacks.net/icons/3/free-warning-sign-icon-9771.png',
            url: 'https://discord.js.org'
        }
    })
}

export const EmbedDanger = (embedOptions: EmbedOptions) => {
    return new EmbedBuilder({
        ...embedOptions,
        color: resolveColor([255, 0, 0]),
        author: {
            name: 'Music-Cord',
            iconURL: 'https://as1.ftcdn.net/v2/jpg/01/45/20/02/1000_F_145200273_450ViYipr5uU3WIwqzwjsRDHYTMcUH9P.jpg',
            url: 'https://discord.js.org'
        }
    })
}

export const EmbedSuccess = (embedOptions: EmbedOptions) => {
    return new EmbedBuilder({
        ...embedOptions,
        color: resolveColor([0, 255, 0]),
        author: {
            name: 'Music-Cord',
            iconURL: 'https://www.pngitem.com/pimgs/m/225-2259724_check-mark-icon-png-png-download-circle-email.png',
            url: 'https://discord.js.org'
        }
    })
}

export const EmbedPrimary = (embedOptions: EmbedOptions) => {
    return new EmbedBuilder({
        ...embedOptions,
        color: resolveColor([255, 0, 0]),
        author: {
            name: 'Music-Cord',
            iconURL: 'https://www.iconpacks.net/icons/4/free-blue-question-icon-11805.png',
            url: 'https://discord.js.org'
        }
    })
}

export const EmbedSecondary = (embedOptions: EmbedOptions) => {
    return new EmbedBuilder({
        ...embedOptions,
        color: resolveColor([255, 0, 0]),
        author: {
            name: 'Music-Cord',
            iconURL: 'https://as1.ftcdn.net/v2/jpg/01/45/20/02/1000_F_145200273_450ViYipr5uU3WIwqzwjsRDHYTMcUH9P.jpg',
            url: 'https://discord.js.org'
        }
    })
}