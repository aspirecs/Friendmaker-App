import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show all available commands'),
  
  async execute(interaction: any) {
    const embed = new EmbedBuilder()
      .setColor('#5865f2')
      .setTitle('📚 FriendMaker Commands')
      .setDescription('Here are all the commands you can use:')
      .addFields(
        {
          name: '🆕 Getting Started',
          value: 
            '`/signup` - Create your FriendMaker account\n' +
            '`/profile` - View your profile\n' +
            '`/edit-profile` - Edit your profile (opens website)'
        },
        {
          name: '🔍 Finding Friends',
          value: 
            '`/discover` - Find new matches\n' +
            '`/instant-connect` - Start anonymous chat\n' +
            '`/matches` - View your connections'
        },
        {
          name: '⚙️ Settings',
          value: 
            '`/settings` - Manage preferences\n' +
            '`/premium` - View Premium benefits\n' +
            '`/referral` - Get your referral code'
        },
        {
          name: '🛟 Support',
          value: 
            '`/feedback` - Send feedback\n' +
            '`/report` - Report abuse\n' +
            '`/help` - Show this message'
        }
      )
      .setFooter({ text: 'Visit friendmaker.app for more features' });
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};