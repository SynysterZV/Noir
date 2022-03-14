import {
    ChatInputApplicationCommandData,
    ChatInputCommandInteraction,
    AutocompleteInteraction
} from "discord.js"

type AIR = Array<{ name: string, value: string }>

export interface Command {
    data: ChatInputApplicationCommandData,
    exec: (interaction: ChatInputCommandInteraction) => unknown
    autocomplete?: (interaction: AutocompleteInteraction) => unknown
}