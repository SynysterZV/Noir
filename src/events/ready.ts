import { Event } from "../types/Event";
import fetch from "node-fetch"

export const event: Event = {
    name: "ready",
    async exec(client) {

        //@ts-ignore
        client.mdnCache = await fetch("https://developer.mozilla.org/en-US/search-index.json").then(res => res.json())

        console.log(`Ready! Logged in as ${client.user.tag}`)
    }
}