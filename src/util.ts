import {
    ActionRow,
    Modal,
    TextInputComponent,
    TextInputStyle
} from "discord.js"

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