import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';
import connectDB from '../../shared/src/lib/db.js';
import { startAPIServer } from './api/server.js';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages
  ]
});

client.commands = new Collection();

// Load commands
const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => 
  file.endsWith('.js') || file.endsWith('.ts')
);

for (const file of commandFiles) {
  const filePath = join(commandsPath, file);
  const command = await import(filePath);
  
  if ('data' in command.default && 'execute' in command.default) {
    client.commands.set(command.default.data.name, command.default);
    console.log(`✅ Loaded command: ${command.default.data.name}`);
  }
}

// Load events
const eventsPath = join(__dirname, 'events');
const eventFiles = readdirSync(eventsPath).filter(file => 
  file.endsWith('.js') || file.endsWith('.ts')
);

for (const file of eventFiles) {
  const filePath = join(eventsPath, file);
  const event = await import(filePath);
  
  if (event.default.once) {
    client.once(event.default.name, (...args) => event.default.execute(...args));
  } else {
    client.on(event.default.name, (...args) => event.default.execute(...args));
  }
  console.log(`✅ Loaded event: ${event.default.name}`);
}

// Connect to database
await connectDB();

// Start API server
startAPIServer(client);

// Login to Discord
client.login(process.env.DISCORD_BOT_TOKEN);

export { client };