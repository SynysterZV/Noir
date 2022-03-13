import { Command } from "../types/Command";
import { ApplicationCommandOptionType } from "discord.js";

export const command: Command = {
    data: {
        name: "ping",
        description: "pong",
        options: [
            {
                name: "ephemeral",
                description: "Hide reply?",
                type: ApplicationCommandOptionType.Boolean
            }
        ]
    },
    
    exec(int) {
        int.reply({ content: "Pong!", ephemeral: int.options.getBoolean("ephemeral") ?? true })
    }
}