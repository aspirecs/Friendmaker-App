import { ActivityType } from 'discord.js';

export default {
  name: 'ready',
  once: true,
  execute(client: any) {
    console.log(`✅ Logged in as ${client.user.tag}`);
    console.log(`📊 Serving ${client.guilds.cache.size} servers`);
    
    // Set bot status
    client.user.setPresence({
      activities: [{
        name: 'friendmaker.app',
        type: ActivityType.Playing
      }],
      status: 'online'
    });
  }
};