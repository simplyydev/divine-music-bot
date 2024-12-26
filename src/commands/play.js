import { joinVoiceChannel } from '@discordjs/voice';
import { createQueue, searchSong, playSong } from '../utils/player.js';

export const playCommand = {
  name: 'play',
  async execute(interaction, client) {
    const query = interaction.options.getString('query');
    
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return interaction.reply('You need to be in a voice channel!');
    }

    await interaction.deferReply();

    try {
      const queue = await createQueue(interaction.guildId, client);
      const songInfo = await searchSong(query);
      
      if (!songInfo) {
        return interaction.editReply('No results found!');
      }

      const song = {
        title: songInfo.video_details.title,
        url: songInfo.video_details.url,
        duration: songInfo.video_details.durationInSec
      };

      queue.songs.push(song);

      if (!queue.playing) {
        queue.playing = true;
        queue.connection = joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: interaction.guildId,
          adapterCreator: interaction.guild.voiceAdapterCreator,
        });
        
        await playSong(queue, interaction.guildId, client);
      }

      await interaction.editReply(`🎵 Added to queue: **${song.title}**`);
    } catch (error) {
      console.error(error);
      await interaction.editReply('There was an error playing this song!');
    }
  }
};