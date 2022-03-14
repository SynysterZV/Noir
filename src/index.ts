import { Client, Collection } from "discord.js";
import prisma from "@prisma/client";
import { loadFiles } from "./util.js";
import { guildIds } from "./constants.js";

import type { Command } from "./types/Command"
import type { CustomModal } from "./types/Modal"

declare module "discord.js" {
    interface Client {
        commands: Collection<string, Command>
        modals: Collection<string, CustomModal>
        db: prisma.PrismaClient
        mdnCache: Array<{ title: string, url: string }>
    }
}

class NoirClient extends Client {
    constructor() {
        super({ intents: ["Guilds"] })

        this.commands = new Collection<string, Command>()
        this.modals = new Collection<string, CustomModal>()
        this.db = new prisma.PrismaClient()
    }
    
    loadCommands() {

        loadFiles("commands", ({ command }: { command: Command }) => {
            if(this.commands.get(command.data.name)) {
                throw new Error(`Duplicate command: ${command.data.name}`)
            }

            this.commands.set(command.data.name, command)
        })

        loadFiles("modals", ({ modal }) => {
            if(this.modals.get(modal.name)) {
                throw new Error(`Duplicate modal: ${modal.name}`)
            }

            this.modals.set(modal.name, modal)
        })

        if(process.argv.slice(2).includes("--set")) {
            this.on("ready", async c => {
                const cmds = this.commands.map(x => x.data)
                const guilds = guildIds.map(x => this.guilds.cache.get(x)).filter(x=>x)

                guilds.forEach(async guild => {
                    await guild?.commands.set(cmds)
                })
            })
        }
    }

    loadEvents() {
        loadFiles("events", ({ event }) => {
            this.on(event.name, event.exec)
        })
    }

    init() {
        this.loadCommands()
        this.loadEvents()

        this.login()
    }
}

new NoirClient().init()