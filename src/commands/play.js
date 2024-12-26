import { createQueue, searchSong, playSong } from '../utils/player.js';
import { createVoiceConnection, setupConnectionListeners } from '../utils/connection.js';

export const playCommand = {
  name: 'play',
  async execute(interaction, client) {
    const query = interaction.options.getString('query');
    
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return interaction.reply('You need to be in a voice channel!');
    }

    const permissions = voiceChannel.permissionsFor(client.user);
    if (!permissions.has('Connect') || !permissions.has('Speak')) {
      return interaction.reply('I need permissions to join and speak in your voice channel!');
    }

    await interaction.deferReply();

    try {
      let queue = await createQueue(interaction.guildId, client);
      const songInfo = await searchSong(query);
      
      if (!songInfo) {
        return interaction.editReply('No results found or there was an error!');
      }

      const song = {
        title: songInfo.video_details.title,
        url: songInfo.video_details.url,
        duration: songInfo.video_details.durationInSec
      };

      queue.songs.push(song);

      if (!queue.connection || !queue.playing) {
        queue.playing = true;
        try {
          queue.connection = await createVoiceConnection(voiceChannel, interaction.guildId);
          setupConnectionListeners(queue.connection, queue);
          await playSong(queue, interaction.guildId, client);
          await interaction.editReply(`🎵 Now playing: **${song.title}**`);
        } catch (error) {
          console.error('Connection error:', error);
          queue.playing = false;
          return interaction.editReply('Failed to join voice channel!');
        }
      } else {
        await interaction.editReply(`🎵 Added to queue: **${song.title}**`);
      }
    } catch (error) {
      console.error('Error in play command:', error);
      await interaction.editReply('There was an error playing this song!');
    }
  }
};