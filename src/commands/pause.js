export const pause = {
  name: 'pause',
  async execute(interaction, client) {
    const queue = client.queues.get(interaction.guildId);
    
    if (!queue || !queue.playing) {
      return interaction.reply('There is nothing playing!');
    }

    queue.player.pause();
    await interaction.reply('⏸️ Paused the current song!');
  }
};