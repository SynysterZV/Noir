import { CustomModal } from "../types/Modal"
import { buildModal } from "../util.js";

export const modal: CustomModal = {
    name: "tag",
    model: buildModal(
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
    ),
    async exec(int) {
        await int.client.db.tag.create({
            data: {
                authorId: int.user.id,
                key: int.components[0].components[0].value,
                value: int.components[1].components[0].value
            }
        }).then(() => {
            int.reply({ content: "Tag successfully created", ephemeral: true })
        }).catch(() => int.reply({ content: "Duplicate tag", ephemeral: true }))
    }
}