import { Command } from "../../types/Command";

export const command: Command = {
    data: {
        name: "stop",
        description: "Stop the music player",
    },
    
    async exec(int) {
        if(!int.guild) return int.reply({ content: "You must be in a guild", ephemeral: true })

        const player = int.client.manager.get(int.guild.id)
        if(!player) return int.reply({ content: "There is no player for this guild", ephemeral: true })

        const member = await int.guild.members.fetch(int.user.id)

        const { channel } = member.voice

        if(!channel) return int.reply({ content: "You need to join a voice channel", ephemeral: true })
        if(channel.id !== player.voiceChannel) return int.reply({ content: "Youre not in the same voice channel as the player", ephemeral: true })

        player.destroy()
        return int.reply({ content: "Music has stopped"})
    }
}