import { createAudioPlayer, createAudioResource, AudioPlayerStatus } from '@discordjs/voice';
import play from 'play-dl';

export async function createQueue(guildId, client) {
  if (!client.queues.has(guildId)) {
    client.queues.set(guildId, {
      songs: [],
      player: createAudioPlayer(),
      connection: null,
      playing: false
    });
  }
  return client.queues.get(guildId);
}

export async function searchSong(query) {
  try {
    if (query.startsWith('http')) {
      return await play.video_info(query);
    }
    
    const searchResults = await play.search(query, { limit: 1 });
    if (!searchResults.length) {
      return null;
    }
    return await play.video_info(searchResults[0].url);
  } catch (error) {
    console.error('Error searching for song:', error);
    return null;
  }
}

export async function playSong(queue, guildId, client) {
  try {
    if (!queue.songs.length) {
      queue.playing = false;
      if (queue.connection) {
        queue.connection.destroy();
      }
      return;
    }

    const song = queue.songs[0];
    
    // Set up stream with proper options
    const stream = await play.stream(song.url, {
      discordPlayerCompatibility: true
    });
    
    const resource = createAudioResource(stream.stream, {
      inputType: stream.type,
      inlineVolume: true
    });

    queue.player.play(resource);
    
    if (!queue.connection.state.status === 'ready') {
      queue.connection.subscribe(queue.player);
    }

    // Handle audio player state changes
    queue.player.on(AudioPlayerStatus.Idle, () => {
      queue.songs.shift();
      playSong(queue, guildId, client);
    });

    queue.player.on('error', error => {
      console.error('Error playing song:', error);
      queue.songs.shift();
      playSong(queue, guildId, client);
    });

  } catch (error) {
    console.error('Error in playSong:', error);
    queue.songs.shift();
    playSong(queue, guildId, client);
  }
}