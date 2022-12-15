const { Client, Intents } = require('discord.js')
const {createAudioPlayer, NoSubscriberBehavior} = require("@discordjs/voice");

module.exports = Object.freeze({
    player: createAudioPlayer({behaviors: {noSubscriber: NoSubscriberBehavior.Pause,}}),
    client: new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] })
});