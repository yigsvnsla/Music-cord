import { ButtonBuilder, ButtonStyle } from 'discord.js';

type ButtonCreateType = typeof ButtonCreateTypes[keyof typeof ButtonCreateTypes]

export class ButtonCreator extends ButtonBuilder {

    /**
     * @param buttonCreateType 
     * 
     * ```
     * //Example creator templates
     *  new ButtonCreator(ButtonCreateTypes.play)
     * ```
     */
    constructor(buttonCreateType: ButtonCreateType);
    /**
     * 
     * @param _label string
     * @param _emoji string
     * @param _style string;
     * 
     * @Example
     * ```
     * //Example creator custom
     *  new ButtonCreator('Play', '▶', ButtonStyle.Danger)
     * ```
     */
    constructor(_label: string, _emoji: string, _style: ButtonStyle)

    /**
     * @Overload Constructor
     * 
     * @param _arg1 string | ButtonCreateType
     * @param _arg2? string
     * @param _arg3? ButtonStyle
     */
    constructor(_arg1: string | ButtonCreateType, _arg2?: string, _arg3?: ButtonStyle) {
        let config = new Object()
        if (Array.isArray(_arg1)) {
            config = {
                customId: `btn-${_arg1[0]}`,
                custom_id: `_btn-${_arg1[0]}`,
                emoji: {
                    name: `${_arg1[1]}`,
                    id: `_emoji-${_arg1[0]}`,
                    animated: true
                },
                //@ts-ignore
                style: ButtonStyle[`${ButtonStyle[_arg1[2]]}`],
                label: `${_arg1[0]}`
            }
        }

        if (typeof _arg1 == 'string') {
            config = {
                customId: `btn-${_arg1}`,
                custom_id: `_btn-${_arg1}`,
                emoji: {
                    name: `${_arg2}`,
                    id: `_emoji-${_arg1}`,
                    animated: true
                },
                //@ts-ignore
                style: ButtonStyle[`${ButtonStyle[_arg3]}`],
                label: `${_arg1}`
            }
        }
        super(config)
    };
}

export const ButtonCreateTypes = {
    pause: ['Pause', '⏸', ButtonStyle.Primary],
    play: ['Play', '▶', ButtonStyle.Success],
    stop: ['Stop', '⏹', ButtonStyle.Danger],
    prev: ['Prev', '⏮', ButtonStyle.Secondary],
    next: ['Next', '⏭', ButtonStyle.Secondary]
} as const
