require('dotenv/config');
const { Client, GatewayIntentBits } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

const client = new Client({
    intents: [
        // What its allowed to see
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
})

// Message when bot is online
client.on('ready', () => {
    console.log("Client is online!")
});

// Get the API Key
const configuration = new Configuration({
    apiKey: process.env.API_KEY_OPEN_AI,
})
const openai = new OpenAIApi(configuration);

// Get message data in terminal
client.on('messageCreate', async (message) => {
    // Dont reply to itself
    if (message.author.bot) return;
    // If chatting in wrong channel, dont send message
    if (message.channel.id !== process.env.CHANNEL_ID) return;
    // Ignore messages started with such prefix (.env)
    if (message.content.startsWith(process.env.MESSAGE_EXCEPTION)) return;

    // What the Bot is based on
    let conversationLog = [{ role: 'system', content: process.env.PROMPT}]

    // Bot Typing Effect
    await message.channel.sendTyping();

    // Limit of previous messages it can remember
    let prevMessages = await message.channel.messages.fetch({ limit: process.env.MESSAGE_MEMORY});
    prevMessages.reverse();

    // Conditions
    prevMessages.forEach((msg) => {
        if (message.content.startsWith(process.env.MESSAGE_EXCEPTION)) return;
        // Only answer people, not other bots
        if (message.author.id !== client.user.id && message.author.bot) return;
        // Only converse with such person instead of all
        if (message.author.id !== message.author.id) return;

        conversationLog.push({
            role: 'user',
            content: message.content,
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
});

// Get data from .env
client.login(process.env.BOT_TOKEN)