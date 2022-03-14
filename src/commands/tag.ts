import { Command } from "../types/Command";
import { ApplicationCommandOptionType } from "discord.js";


export const command: Command = {
    data: {
        name: "tag",
        description: "tag",
        options: [
            {
                name: "create",
                description: "Create a tag",
                type: ApplicationCommandOptionType.Subcommand
            },
            {
                name: "show",
                description: "Display a tag",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "name",
                        description: "tag name",
                        type: ApplicationCommandOptionType.String,
                        required: true,
                        autocomplete: true
                    }
                ]
            },
            {
                name: "delete",
                description: "Delete a tag",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "name",
                        description: "tag name",
                        type: ApplicationCommandOptionType.String,
                        required: true,
                        autocomplete: true
                    }
                ]
            }
        ]
    },
    
    async exec(int) {
        switch(int.options.getSubcommand()) {
            case "create":
                const modal = int.client.modals.get("tag")
                if(!modal) return
                return int.showModal(modal.model)

            case "show":
                const tag = await int.client.db.tag.findUnique({
                    where: {
                        key: int.options.getString("name", true)
                    }
                })

                return int.reply({ content: tag?.value })

            case "delete":
                await int.client.db.tag.delete({
                    where: {
                        key: int.options.getString("name", true)
                    }
                })

                return int.reply("Tag successfully deleted")
        }
    },

    async autocomplete(int) {
        const tags = await int.client.db.tag.findMany({
            where: {
                key: { contains: String(int.options.getFocused()) }
            }
        })

        int.respond(
            tags.map(({ key }: { key: string }) => ({ name: key, value: key })).slice(0,25)
        )
    }
}