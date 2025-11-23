import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const commands: any[] = [];
const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => 
  file.endsWith('.js') || file.endsWith('.ts')
);

for (const file of commandFiles) {
  const filePath = join(commandsPath, file);
  const command = await import(filePath);
  
  if ('data' in command.default && 'execute' in command.default) {
    commands.push(command.default.data.toJSON());
  }
}

const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN!);

(async () => {
  try {
    console.log(`🔄 Deploying ${commands.length} application commands...`);
    
    const data = await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!),
      { body: commands }
    ) as any;
    
    console.log(`✅ Successfully deployed ${data.length} application commands`);
  } catch (error) {
    console.error('❌ Error deploying commands:', error);
  }
})();