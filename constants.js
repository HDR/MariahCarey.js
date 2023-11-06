const { Client, GatewayIntentBits, Partials  } = require('discord.js')
const {createAudioPlayer, NoSubscriberBehavior} = require("@discordjs/voice");

module.exports = Object.freeze({
    player: createAudioPlayer({behaviors: {noSubscriber: NoSubscriberBehavior.Pause,}}),
    client: new Client({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
        partials: [Partials.Channel]
    })
});