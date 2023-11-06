const {client, player} = require("./constants");
const servers = require('./servers.json')
const fs = require('fs')
const { token } = require('./config.json')
const { createAudioResource, joinVoiceChannel} = require('@discordjs/voice');
const mp3Duration = require('mp3-duration');
const { Collection, REST, Routes, EmbedBuilder, Events} = require('discord.js');
const commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

client.commands = new Collection;

for (const file of commands) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command)
}

async function registerCommands(){
    const commandData = []
    for (const file of commands) {
        if (!client.application?.owner) await client.application?.fetch();
        const command = require(`./commands/${file}`);
        commandData.push(command.data.toJSON());

    }
    const rest = new REST({ version: '10' }).setToken(token);

    (async () => {
        try {
            console.log(`Started refreshing ${commandData.length} application (/) commands.`);

            const data = await rest.put(
                Routes.applicationCommands(client.application.id),
                {body: commandData},
            );

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            console.error(error);
        }
    })().then();
}

client.on(Events.InteractionCreate, async interaction => {

    if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error executing ${interaction.commandName}`);
            console.error(error);
        }
    }
})


client.login(token).then(registerCommands).then();

client.on('ready', async () => {
    client.user.setPresence({ activities: [{ name: `Currently in ${client.guilds.cache.size} servers` }] });
    await loopMusic();
});

async function loopMusic() {
    mp3Duration('./music/music.mp3', (err, duration) => {
        if (err) return console.log(err.message);
        setTimeout(() => {
            loopMusic();
        }, duration * 1000 + 1000);
    });


    const resource = createAudioResource("./music/music.mp3", {
        inlineVolume: true,
        metadata: {
            title: "Christmas",
        }
    });

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

client.on(Events.MessageCreate, async msg => {
    if (msg.guild === null) {
        let guild = client.guilds.cache.get('297663164701605888');
        if(!msg.author.bot) {
            const Embed = new EmbedBuilder();
            Embed.setColor('#0D22CC');
            Embed.setTitle('User Sent Message to Mariah')
            Embed.addFields({name: 'User:', value: msg.author.username})
            if(msg.content.length > 0) {
                Embed.addField('Message:', `${msg.content}`);
                await msg.reply({content: 'Thank you, your feedback has been recorded.'})
            }
            await guild.channels.cache.get('1040819379933302814').send({embeds: [Embed]});
        }
    }
});