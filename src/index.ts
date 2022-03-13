import { Client, Collection } from "discord.js";
import prisma from "@prisma/client";
import { join } from "path"
import glob from "glob"

import type { Command } from "./types/Command"

declare module "discord.js" {
    interface Client {
        commands: Collection<string, Command>
        db: prisma.PrismaClient
    }
}

class NoirClient extends Client {
    constructor() {
        super({ intents: ["Guilds"] })

        this.commands = new Collection<string, Command>()
        this.db = new prisma.PrismaClient()
    }
    
    loadCommands() {
        glob.sync(join("dist", "commands", "**", "*.js"), { absolute: true })
            .forEach(file => {
                import(file).then(({ command }: { command: Command }) => {
                    if(this.commands.get(command.data.name)) {
                        throw new Error(`Duplicate command: ${command.data.name}`)
                    }

                    this.commands.set(command.data.name, command)
                })
            })

        if(process.argv.slice(2).includes("--set")) {
            this.on("ready", async c => {
                const cmds = this.commands.map(x => x.data)
                const guild = c.guilds.cache.get("951313412682575943")
                if(!guild) return

                await guild.commands.set(cmds)
            })
        }

        this.on("interactionCreate", async int => {
            if(int.isChatInputCommand()) {
                const cmd = this.commands.get(int.commandName)
                if(!cmd) return

                cmd.exec(int)
            }

            if(int.isAutocomplete()) {
                if(int.commandName == "tag") {
                    const tags = await int.client.db.tag.findMany({
                        where: {
                            key: { contains: String(int.options.getFocused()) }
                        }
                    })

                    int.respond(
                        tags.map(({ key }: { key: string }) => ({ name: key, value: key })).slice(0,25)
                    )
                }
            }

            if(int.isModalSubmit()) {
                if(int.customId == "tag") {
                    await this.db.tag.create({
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
        })
    }

    loadEvents() {
        glob.sync(join("dist", "events", "**", "*.js"), { absolute: true })
            .forEach(file => {
                import(file).then(({ event }) => {
                    this.on(event.name, event.exec)
                })
            })
    }

    init() {
        this.loadCommands()
        this.loadEvents()

        this.login()
    }
}

new NoirClient().init()