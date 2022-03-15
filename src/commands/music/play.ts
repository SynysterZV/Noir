import { Command } from "../../types/Command";
import { ApplicationCommandOptionType } from "discord.js";

export const command: Command = {
    data: {
        name: "play",
        description: "Play a song",
        options: [
            {
                name: "query",
                description: "Song to search for",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    
    async exec(int) {
        if(!int.guild) return int.reply({ content: "You must be in a guild!", ephemeral: true })

        const member = await int.guild.members.fetch(int.user.id)
        if(!member.voice.channel) return int.reply({ content: "You must be in a voice channel!", ephemeral: true })

        let res

        try {
            res = await int.client.manager.search(int.options.getString("query", true))

            if(res.loadType === "LOAD_FAILED") throw res.exception
            else if (res.loadType === "PLAYLIST_LOADED") throw { message: "Playlists are not supported with this command" }
        } catch (e: any) {
            return int.reply({ content: `There was an error while searching: ${e.message}`, ephemeral: true })
        }

        if (res.loadType == "NO_MATCHES") return int.reply({ content: "There were no matches", ephemeral: true })

        const player = int.client.manager.create({
            guild: int.guild.id,
            voiceChannel: member.voice.channel.id,
            textChannel: int.channelId
        })

        player.connect()
        player.queue.add(res.tracks[0])

        if(!player.playing && !player.paused && !player.queue.size) player.play()

        return int.reply({ content: `enqueing ${res.tracks[0].title}` })
    }
}