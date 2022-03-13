import { ClientEvents } from "discord.js"

export type Event = {
    [K in keyof ClientEvents]: {
        name: K;
        exec: (...args: ClientEvents[K]) => unknown
    }
}[keyof ClientEvents]