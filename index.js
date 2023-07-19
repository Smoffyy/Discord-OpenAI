require('dotenv/config');
const { Client, IntentsBitField } = require('discord.js')
const { Configuration, OpenAIApi } = require('openai');

const client = new Client({
    intents: [
        // What its allowed to see
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.Guilds.Messages,
        IntentsBitField.Flags.Guilds.MessageContent,
    ]
})

// Message when bot is online
client.on('ready', () => {
    console.log("Client is online!")
})

// Get the API Key
const configuration = new Configuration({
    apiKey: process.env.API_KEY_OPEN_AI,
})
const openai = new OpenAIApi(configuration);

// Get message data in terminal
client.on('messageCreate', async (message) => {
    //console.log(message)
    if (message.author.bot) return;
    // If chatting in wrong channel, dont send message
    if (message.channel.id !== process.env.CHANNEL_ID) return;
    // Ignore messages started with such prefix (.env)
    //if (message.content.startsWith('!')) return;
    if (message.content.startsWith(process.env.BOT_IGNORE)) return;
    // What the Bot is bassed on
    let conversationLog = [{ role: 'system', content: "You are an AI, which expresses its Opinions, Beliefs and Thoughts!"}]

    // Bot Typing Effect
    await message.channel.sendTyping();

    // Limit of previous messages it can remember
    //let prevMessages = await message.channel.messages.fetch({ limit: 15});
    let prevMessages = await message.channel.messages.fetch({ limit: process.env.MEMORY_MESSAGE_LIMIT});
    prevMessages.reverse();

    // Conditions
    prevMessages.forEach((msg) => {
        //if (message.content.startsWith('!')) return;
        if (message.content.startsWith(process.env.BOT_IGNORE)) return;
        // Only answer people, not other bots
        if (msg.author.id !== client.user.id && message.author.bot) return;
        // Only converse with such person instead of all
        if (msg.author.id !== message.author.id) return;

        conversationLog.push({
            role: 'user',
            content: msg.content,
        });
    });

    // Model Stuff
    const result = await openai.createChatCompletion({
        // Model Type
        model: 'gpt-3.5-turbo',
        messages: conversationLog,
    });
    //[0] is the first choice to pick
    message.reply(result.data.choices[0].message);
})

// Get data from .env
client.login(process.env.TOKEN)