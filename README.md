# 🤝 FriendMaker

AI-powered friendship matching platform with Discord integration.

## 📋 Prerequisites

- Node.js 22 LTS
- MongoDB 8.0+
- Redis 7.4+
- Python 3.12+ (for ML service)
- Discord Bot Token
- OpenAI API Key
- Stripe Account
- Vercel Account (for website)
- Railway/Render Account (for bot)

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/friendmaker.git
cd friendmaker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy `.env.example` to `.env` in each workspace:

```bash
cp website/.env.example website/.env
cp discord-bot/.env.example discord-bot/.env
cp shared/.env.example shared/.env
```

Fill in the environment variables in each `.env` file.

### 4. Setup MongoDB

Create a MongoDB Atlas cluster or use local MongoDB:

```bash
# If using local MongoDB
mongod --dbpath /path/to/data
```

### 5. Run Development Servers

```bash
npm run dev
```

This starts:
- Website: http://localhost:3000
- Discord Bot: Running in background
- Bot API: http://localhost:3001

## 📁 Project Structure

```
friendmaker/
├── website/              # Next.js website
├── discord-bot/          # Discord.js bot
├── shared/               # Shared code (models, utils)
├── ml-service/           # Python ML service
├── qa-system/            # Automated QA system
└── docs/                 # Documentation
```

## 🔧 Configuration

### Website (.env)

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
BOT_API_URL=http://localhost:3001
BOT_API_SECRET=your_secret_here
MONGODB_URI=mongodb://localhost:27017/friendmaker
REDIS_URL=redis://localhost:6379
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
OPENAI_API_KEY=your_openai_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### Discord Bot (.env)

```env
DISCORD_BOT_TOKEN=your_bot_token
DISCORD_CLIENT_ID=your_client_id
MONGODB_URI=mongodb://localhost:27017/friendmaker
REDIS_URL=redis://localhost:6379
WEBSITE_URL=http://localhost:3000
BOT_API_SECRET=your_secret_here
NODE_ENV=development
```

## 🧪 Testing

```bash
npm test
```

## 📦 Deployment

### Website (Vercel)

```bash
cd website
vercel
```

### Discord Bot (Railway)

```bash
cd discord-bot
railway up
```

## 📚 Documentation

Full documentation available at `docs/`

- [Architecture](docs/architecture.md)
- [API Reference](docs/api.md)
- [Database Schema](docs/database.md)
- [Deployment Guide](docs/deployment.md)

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) file.