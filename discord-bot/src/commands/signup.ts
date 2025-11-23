import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import User from '../../../shared/src/models/User.js';
import connectDB from '../../../shared/src/lib/db.js';
import { generateSignupToken } from '../utils/tokens.js';

export default {
  data: new SlashCommandBuilder()
    .setName('signup')
    .setDescription('Create your FriendMaker account'),
  
  async execute(interaction: any) {
    await interaction.deferReply({ ephemeral: true });
    
    try {
      await connectDB();
      
      const discordId = interaction.user.id;
      const username = interaction.user.username;
      const discriminator = interaction.user.discriminator;
      const avatar = interaction.user.displayAvatarURL();
      
      let user = await User.findOne({ discordId });
      
      if (user) {
        const embed = new EmbedBuilder()
          .setColor('#5865f2')
          .setTitle('✅ Account Already Exists')
          .setDescription('You already have a FriendMaker account!')
          .addFields(
            { name: '📱 Dashboard', value: `${process.env.WEBSITE_URL}/dashboard` },
            { name: '👤 Profile', value: `${process.env.WEBSITE_URL}/profile` }
          );
        
        return interaction.editReply({ embeds: [embed] });
      }
      
      user = await User.create({
        discordId,
        username,
        discriminator,
        avatar,
        profileComplete: false,
        onboardingStep: 'discord_signup_complete',
        createdAt: new Date()
      });
      
      const signupToken = generateSignupToken(user._id.toString());
      const signupUrl = `${process.env.WEBSITE_URL}/signup?token=${signupToken}`;
      
      const embed = new EmbedBuilder()
        .setColor('#5865f2')
        .setTitle('👋 Welcome to FriendMaker!')
        .setDescription('Your account has been created! Now let\'s complete your profile.')
        .addFields(
          {
            name: '📝 Next Steps',
            value: 
              '1. Click the button below to open the website\n' +
              '2. Complete your personality quiz\n' +
              '3. Add your interests\n' +
              '4. Start making friends!'
          },
          { name: '⏰ Time Estimate', value: '5-10 minutes', inline: true },
          { name: '🎁 Reward', value: 'Profile completion badge', inline: true }
        )
        .setFooter({ text: 'Link expires in 24 hours' });
      
      const button = new ButtonBuilder()
        .setLabel('Complete Your Profile')
        .setStyle(ButtonStyle.Link)
        .setURL(signupUrl)
        .setEmoji('🚀');
      
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
      
      await interaction.editReply({
        embeds: [embed],
        components: [row]
      });
      
      console.log(`✅ New signup: ${username} (${discordId})`);
      
    } catch (error) {
      console.error('Signup error:', error);
      await interaction.editReply({
        content: '❌ An error occurred during signup. Please try again later.'
      });
    }
  }
};