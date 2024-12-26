# Divine Music Bot

A free, high-quality Discord music bot that brings divine music to your server! 🎵

## Features

- Play music from YouTube
- Queue system
- Basic controls (play, pause, resume, skip, stop)
- High-quality audio playback
- Completely free to use

## Setup Guide

1. **Prerequisites**
   - [Node.js](https://nodejs.org/) (v16.9.0 or higher)
   - A Discord account and a server where you have admin permissions

2. **Create a Discord Application**
   1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
   2. Click "New Application" and name it "Divine"
   3. Go to the "Bot" section and click "Add Bot"
   4. Copy the bot token (you'll need this later)
   5. Under "Privileged Gateway Intents", enable:
      - Server Members Intent
      - Message Content Intent
      - Voice State Intent

3. **Invite the Bot**
   1. Go to the "OAuth2" section in your Discord application
   2. Select "bot" and "applications.commands" under "Scopes"
   3. Under "Bot Permissions", select:
      - Send Messages
      - Connect
      - Speak
      - Use Voice Activity
   4. Copy the generated URL and open it in your browser to invite the bot

4. **Setup the Bot**
   1. Clone this repository
   2. Install dependencies:
      ```bash
      npm install
      ```
   3. Create a `.env` file in the root directory with:
      ```
      DISCORD_TOKEN=your_bot_token_here
      CLIENT_ID=your_application_id_here
      GUILD_ID=your_server_id_here
      ```
   4. Start the bot:
      ```bash
      npm start
      ```

## Commands

- `/play <song>`: Play a song (URL or search term)
- `/pause`: Pause the current song
- `/resume`: Resume playback
- `/skip`: Skip to the next song
- `/stop`: Stop playback and clear queue
- `/queue`: Show the current queue

## Need Help?

If you encounter any issues, make sure:
1. All dependencies are installed
2. Your `.env` file is properly configured
3. The bot has proper permissions in your server
4. You're in a voice channel when using music commands