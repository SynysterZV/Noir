import { Event } from "../types/Event";

export const event: Event = {
    name: "ready",
    exec(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`)
    }
}