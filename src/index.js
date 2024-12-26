import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { config } from 'dotenv';
import { registerCommands } from './deploy-commands.js';
import { playCommand } from './commands/play.js';
import { skip } from './commands/skip.js';
import { stop } from './commands/stop.js';
import { queue } from './commands/queue.js';
import { pause } from './commands/pause.js';
import { resume } from './commands/resume.js';

config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
  ],
});

client.commands = new Collection();
client.queues = new Collection();

// Register commands
client.commands.set('play', playCommand);
client.commands.set('skip', skip);
client.commands.set('stop', stop);
client.commands.set('queue', queue);
client.commands.set('pause', pause);
client.commands.set('resume', resume);

client.once('ready', () => {
  console.log('Divine Music Bot is ready! 🎵');
  registerCommands();
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: 'There was an error executing this command!',
      ephemeral: true,
    });
  }
});

client.login(process.env.DISCORD_TOKEN);