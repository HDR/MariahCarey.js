const {client, player} = require("../constants");
const { PermissionFlagsBits, SlashCommandBuilder} = require("discord.js")
const fs = require('fs');
const {joinVoiceChannel} = require("@discordjs/voice");
const servers = require("../servers.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setchannel')
        .setDescription('Set Mariah to use your current voice channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDMPermission(false),


    execute: function (interaction) {

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