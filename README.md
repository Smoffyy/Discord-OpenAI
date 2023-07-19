# Discord (OpenAI) Chatbot
This repository contains the basic code for an AI chatbot using OpenAI's api.
You may change whatever you like.

# Creating your Bot
1. You need to get [Discord](discord.com)
2. Next you need to head over to the [Developer-Portal](https://discord.com/developers/applications), from there you need to create your bot and get your bots token
3. Rename example.env to .env, and paste your bot token
4. Your bots gonna need permissions, so stay on [Developer-Portal](https://discord.com/developers/applications).
5. Go click OAuth2
6. Click URL Generator, and sent these permissions.
- bot
- Send messages
- Read Message History

## Installation
You need to download some depdendencies.
- [Node.js](https://nodejs.org/en)
- [Vscode](https://code.visualstudio.com/)

### Install dependencies
initialize the npm install.
```shell
npm init -y
```
install discord.js, open, dotenv
```shell
npm install discord.js openai dotenv
```