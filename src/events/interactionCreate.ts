import { Event } from "../types/Event";

export const event: Event = {
    name: "interactionCreate",
    exec(int) {
        if(int.isChatInputCommand()) {
            const cmd = int.client.commands.get(int.commandName)
            if(!cmd) return

            cmd.exec(int)
        }

        if(int.isAutocomplete()) {
            const cmd = int.client.commands.get(int.commandName)
            if(!cmd || !cmd.autocomplete) return

            cmd.autocomplete(int)
        }

        if(int.isModalSubmit()) {
            const modal = int.client.modals.get(int.customId)
            if(!modal) return

            modal.exec(int)
        }
    }
}