import { Command } from "../types/Command";
import { MDNDoc } from "../types/MDN";
import { ApplicationCommandOptionType, Embed } from "discord.js";
import fetch from "node-fetch"

export const command: Command = {
    data: {
        name: "mdn",
        description: "Search MDN docs",
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
        const url = "https://developer.mozilla.org"
        const query = int.options.getString("query", true)

        let search: any

        if(!query.startsWith('/')) {
            try {
                const res: any = await fetch(url + "/api/v1/search?q=" + query).then(res => res.json())
                search = res.documents[0].mdn_url
            } catch (e) {
                return int.reply({ content: "No results found!", ephemeral: true })
            }         
        }

        //@ts-ignore
        const res: MDNDoc = await fetch(url + (search || query) + "/index.json").then(res => res.json())

        const { doc } = res

        const embed = new Embed()
            .setAuthor({ name: "MDN", url, iconURL: "https://avatars.githubusercontent.com/u/7565578?s=200&v=4" })
            .setTitle(doc.title)
            .setURL(url + doc.mdn_url)
            .setDescription(doc.summary.replaceAll('\n', '') + `\n\n[View on Github](${doc.source.github_url})`)

        int.reply({ embeds: [embed] })
    },

    autocomplete(int) {
        const terms = int.client.mdnCache.filter(x => x.title.toLowerCase().includes(String(int.options.getFocused()).toLowerCase()) && x.url.length < 100).slice(0,24)

        int.respond(
            terms.map(x => ({ name: x.title, value: x.url }))
        )
    }
}

