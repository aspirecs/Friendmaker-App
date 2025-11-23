export default {
  name: 'interactionCreate',
  async execute(interaction: any) {
    if (!interaction.isChatInputCommand()) return;
    
    const command = interaction.client.commands.get(interaction.commandName);
    
    if (!command) {
      console.error(`Command ${interaction.commandName} not found`);
      return;
    }
    
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error('Error executing command:', error);
      
      const errorMessage = '❌ There was an error executing this command!';
      
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: errorMessage, ephemeral: true });
      } else {
        await interaction.reply({ content: errorMessage, ephemeral: true });
      }
    }
  }
};