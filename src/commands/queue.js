export const queue = {
  name: 'queue',
  async execute(interaction, client) {
    const queue = client.queues.get(interaction.guildId);
    
    if (!queue || !queue.songs.length) {
      return interaction.reply('There are no songs in the queue!');
    }

    const queueList = queue.songs
      .map((song, index) => `${index + 1}. ${song.title}`)
      .join('\n');

    await interaction.reply(`📜 **Current Queue:**\n${queueList}`);
  }
};