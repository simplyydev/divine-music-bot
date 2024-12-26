import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } from '@discordjs/voice';
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
  if (query.startsWith('http')) {
    return await play.video_info(query);
  }
  
  const searchResults = await play.search(query, { limit: 1 });
  if (!searchResults.length) {
    return null;
  }
  return await play.video_info(searchResults[0].url);
}

export async function playSong(queue, guildId, client) {
  if (queue.songs.length === 0) {
    queue.playing = false;
    queue.connection.destroy();
    return;
  }

  const song = queue.songs[0];
  const stream = await play.stream(song.url);
  const resource = createAudioResource(stream.stream, {
    inputType: stream.type
  });

  queue.player.play(resource);
  queue.connection.subscribe(queue.player);

  queue.player.on(AudioPlayerStatus.Idle, () => {
    queue.songs.shift();
    playSong(queue, guildId, client);
  });
}