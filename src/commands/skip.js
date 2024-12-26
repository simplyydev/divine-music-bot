export const skip = {
  name: 'skip',
  async execute(interaction, client) {
    const queue = client.queues.get(interaction.guildId);
    
    if (!queue || !queue.playing) {
      return interaction.reply('There is nothing playing!');
    }

    queue.player.stop();
    await interaction.reply('⏭️ Skipped the current song!');
  }
};