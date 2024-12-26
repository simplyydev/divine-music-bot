export const resume = {
  name: 'resume',
  async execute(interaction, client) {
    const queue = client.queues.get(interaction.guildId);
    
    if (!queue || !queue.playing) {
      return interaction.reply('There is nothing to resume!');
    }

    queue.player.unpause();
    await interaction.reply('▶️ Resumed the current song!');
  }
};