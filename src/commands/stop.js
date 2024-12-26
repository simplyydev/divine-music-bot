export const stop = {
  name: 'stop',
  async execute(interaction, client) {
    const queue = client.queues.get(interaction.guildId);
    
    if (!queue || !queue.playing) {
      return interaction.reply('There is nothing playing!');
    }

    queue.songs = [];
    queue.player.stop();
    queue.connection.destroy();
    queue.playing = false;
    
    await interaction.reply('⏹️ Stopped playing and cleared the queue!');
  }
};