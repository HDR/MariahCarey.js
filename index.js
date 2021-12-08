const {client, player} = require("./constants");
const Discord = require('discord.js')
const servers = require('./servers.json')
const fs = require('fs')
const { token } = require('./config.json')
const commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const { createAudioResource, joinVoiceChannel} = require('@discordjs/voice');

client.commands = new Discord.Collection();

for (const file of commands) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command)
}

async function registerCommands(){
    const data = []
    for (const file of commands) {
        if (!client.application?.owner) await client.application?.fetch();
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command)
        console.log(file)
        data.push({
            name: command.name,
            type: command.type,
            defaultPermission: command.defaultPermission,
            description: command.description,
            options: command.options
        },);

    }
    await client.application?.commands.set(data).then();
}

client.on('interactionCreate', async interaction => {
    try{
        const command = client.commands.get(interaction.commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(interaction.commandName));
        command.execute(interaction);
    } catch (error) {
        console.error(error);
    }
});

client.login(token).then(registerCommands).then();

client.on('ready', async () => {
    client.user.setPresence({ activities: [{ name: `Currently in ${client.guilds.cache.size} servers` }] });
    await loopMusic();
});

async function loopMusic() {

    setTimeout(() => {
        loopMusic();
    }, 242000);


    const resource = createAudioResource("./music.mp3", {
        inlineVolume: true,
        metadata: {
            title: "Christmas",
        }
    });

    resource.volume.setVolume(0.5);
    await player.play(resource);

    Object.keys(servers).forEach(function(key) {
        try {
            joinVoiceChannel({
                channelId: servers[key],
                guildId: key,
                adapterCreator: client.guilds.cache.get(key).voiceAdapterCreator
            }).subscribe(player)
        } catch (e) {console.log(`Could not connect to ${key}`)}
    });
}