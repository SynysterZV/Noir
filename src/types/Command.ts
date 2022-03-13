import {
    ChatInputApplicationCommandData,
    ChatInputCommandInteraction
} from "discord.js"

export interface Command {
    data: ChatInputApplicationCommandData,
    exec: (interaction: ChatInputCommandInteraction) => unknown
}