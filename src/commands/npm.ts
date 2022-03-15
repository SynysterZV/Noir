import { Command } from "../types/Command";
import { ApplicationCommandOptionType, Embed } from "discord.js";
import fetch from "node-fetch"

import { NPMDoc } from "../types/NPM";

export const command: Command = {
    data: {
        name: "npm",
        description: "Search npm",
        options: [
            {
                name: "query",
                description: "What to search?",
                type: ApplicationCommandOptionType.String,
                required: true,
                autocomplete: true
            }
        ]
    },

    async exec(int) {
        const query = int.options.getString("query", true)

        if(!query.startsWith("https")) return int.reply({ content: "No results found!", ephemeral: true })

        //@ts-ignore
        const res: NPMDoc = await fetch(query).then(res => res.json())

        const latest = res.versions[res["dist-tags"].latest]
        const creationDate = (new Date(res.time.created).getTime() / 1000).toFixed(0)
        const modifiedDate = (new Date(res.time.modified).getTime() / 1000).toFixed(0)

        const embed = new Embed({ color: 0xCD0000 })
            .setAuthor({ name: "NPM", url: "https://npmjs.org", iconURL: "https://avatars.githubusercontent.com/u/6078720?s=200&v=4" })
            .setTitle(res.name)
            .setURL(`https://npmjs.org/${res.name}`)
            .setDescription(res.description)
            .setFields(
                {
                    name: "Lastest Version",
                    value: latest.version,
                    inline: true
                },
                {
                    name: "License",
                    value: latest.license || "None",
                    inline: true
                },
                {
                    name: "Homepage",
                    value: latest.homepage,
                    inline: true
                },
                {
                    name: "Dates",
                    value: `• Created: <t:${creationDate}> (<t:${creationDate}:R>)\n• Modified: <t:${modifiedDate}> (<t:${modifiedDate}:R>)`,
                },
                {
                    name: "Maintainers",
                    value: latest.maintainers.map(x => x.name).join(", ")
                },
                {
                    name: "Dependencies",
                    value: Object.keys(latest.dependencies).join(", ")
                }
            )
            .setFooter({ text: "shasum: " + latest.dist.shasum })

            if(latest.devDependencies) {
                embed.addFields(
                    {
                        name: "Developer Dependencies",
                        value: Object.keys(latest.devDependencies).join(", ")
                    }
                )
            }

        int.reply({ embeds: [ embed ] })
    },

    async autocomplete(int) {
        const packages: any = await fetch(`https://registry.npmjs.org/-/v1/search?text=${int.options.getFocused()}`).then(res=>res.json())

        int.respond(
            packages.objects.map((x: any) => ({ name: x.package.name, value: `https://registry.npmjs.org/${x.package.name}`})).slice(0,25)
        )
    }
}

