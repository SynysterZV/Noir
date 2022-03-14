import {
    ActionRow,
    Modal,
    TextInputComponent,
    TextInputStyle,
    Embed
} from "discord.js"

import { join } from "path"
import glob from "glob"

interface ModalBuilder {
    id: string,
    title: string
    components: Array<{
        id: string,
        label: string,
        style: "Short" | "Paragraph"
        required: boolean
    }>
}

export function buildModal(modal: ModalBuilder) {
    return new Modal()
        .setTitle(modal.title)
        .setCustomId(modal.id)
        .setComponents(
            ...modal.components.map(c =>
                new ActionRow<TextInputComponent>()
                    .setComponents(
                        new TextInputComponent()
                            .setCustomId(c.id)
                            .setLabel(c.label)
                            .setStyle(TextInputStyle[c.style])
                            .setRequired(c.required)
                    )
            )
        )
}

export function arrayToChoices(x: Array<string>) {
    return x.map(y => ({ name: y, value: y }))
}

export function trimEmbed(embed: Embed) {
    embed.fields?.forEach(x => {
        if(x.value.length > 1024) {
            x.value = x.value.slice(0,1021).replaceAll(/`[^` ]+(?!`)$/gs, '') + "..."
        }
    })

    return embed
}

export function loadFiles(path: string, fn: (...args: any) => unknown) {
    glob.sync(join("dist", path, "**", "*.js"), { absolute: true })
        .forEach(file => {
            import(file).then(fn)
        })
}