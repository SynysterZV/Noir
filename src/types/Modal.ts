import { Modal, ModalSubmitInteraction } from "discord.js"

export interface CustomModal {
    name: string;
    model: Modal;
    exec: (int: ModalSubmitInteraction) => unknown
}