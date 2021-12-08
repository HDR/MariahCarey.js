const {client, player} = require("../constants");
const { Permissions } = require("discord.js")
const fs = require('fs');
const {joinVoiceChannel} = require("@discordjs/voice");
const servers = require("../servers.json");

module.exports = {
    name: 'setchannel',
    description: 'Set Mariah to use your current voice channel',
    execute: function (interaction) {

        if (!interaction.guild) {
            interaction.reply("This command can not be used over private message!")
            return
        }

        if(interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
            if(!interaction.member.voice.channel) {
                interaction.reply(
                    "You're not in a voice channel!")
                return
            }

            servers[interaction.guildId] = interaction.member.voice.channel.id

            fs.writeFile("./servers.json", JSON.stringify(servers), (err) => {
                if (err) console.log(err);
            });

            joinVoiceChannel({
                channelId: interaction.member.voice.channel.id,
                guildId: interaction.guildId,
                adapterCreator: client.guilds.cache.get(interaction.guildId).voiceAdapterCreator
            }).subscribe(player)


            client.user.setPresence({ activities: [{ name: `Currently in ${client.guilds.cache.size} servers` }] });
            interaction.reply({content: `Set Mariah to ${interaction.member.voice.channel.name}`, ephemeral: true });
        }
    }
}