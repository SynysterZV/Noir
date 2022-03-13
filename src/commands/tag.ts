import { Command } from "../types/Command";
import { buildModal } from "../util.js";
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
                return int.showModal(buildModal(
                    {
                        title: "Create tag",
                        id: "tag",
                        components: [
                            {
                                label: "Name",
                                id: "tag_key",
                                style: "Short",
                                required: true
                            },
                            {
                                label: "Value",
                                id: "tag_value",
                                style: "Paragraph",
                                required: true
                            }
                        ]
                    }
                ))

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
    }
}