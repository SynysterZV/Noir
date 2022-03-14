import { Command } from "../types/Command";
import { Sources } from "../constants.js";
import { arrayToChoices, trimEmbed } from "../util.js";
import { ApplicationCommandOptionType } from "discord.js";
import Doc from "discord.js-docs"

export const command: Command = {
    data: {
        name: "docs",
        description: "docs",
        options: [
            {
                name: "query",
                description: "Search term",
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: "source",
                description: "Docs source",
                type: ApplicationCommandOptionType.String,
                choices: arrayToChoices(Sources)
            }
        ]
    },

    async exec(int) {
        const doc = await Doc.fetch(int.options.getString("source") || "main")

        const embed = doc.resolveEmbed(int.options.getString("query", true))
        if(!embed) return int.reply({ content: "No results found!", ephemeral: true })

        int.reply({ embeds: [trimEmbed(embed)] })
    }
}