import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

export function startAPIServer(client: any) {
  const app = express();
  const PORT = process.env.BOT_API_PORT || 3001;
  
  app.use(helmet());
  app.use(cors({
    origin: process.env.WEBSITE_URL,
    credentials: true
  }));
  app.use(express.json());
  
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  });
  app.use('/api/', limiter);
  
  const authenticateAPI = (req: any, res: any, next: any) => {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey || apiKey !== process.env.BOT_API_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    next();
  };
  
  app.use('/api/', authenticateAPI);
  
  app.get('/api/bot/status', (req, res) => {
    const status = {
      online: client.isReady(),
      uptime: process.uptime(),
      guilds: client.guilds.cache.size,
      users: client.users.cache.size,
      ping: client.ws.ping,
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV
    };
    
    res.json(status);
  });
  
  app.post('/api/bot/notification', async (req, res) => {
    try {
      const { userId, message, embed } = req.body;
      
      if (!userId || !message) {
        return res.status(400).json({ error: 'userId and message required' });
      }
      
      const user = await client.users.fetch(userId);
      
      if (embed) {
        await user.send({ content: message, embeds: [embed] });
      } else {
        await user.send(message);
      }
      
      res.json({ success: true, userId });
      
    } catch (error: any) {
      console.error('Failed to send notification:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get('/api/bot/user/:userId/guilds', async (req, res) => {
    try {
      const { userId } = req.params;
      
      const guilds = client.guilds.cache
        .filter((guild: any) => guild.members.cache.has(userId))
        .map((guild: any) => ({
          id: guild.id,
          name: guild.name,
          icon: guild.iconURL(),
          memberCount: guild.memberCount
        }));
      
      res.json({ guilds });
      
    } catch (error: any) {
      console.error('Failed to fetch guilds:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  app.listen(PORT, () => {
    console.log(`🚀 Bot API server running on port ${PORT}`);
  });
}