# FriendMaker Setup Guide

## Prerequisites

Before you begin, ensure you have:

- **Node.js 22 LTS** installed
- **MongoDB 8.0+** (Atlas or local)
- **Redis 7.4+** (Upstash or local)
- **Discord Bot** created at [Discord Developer Portal](https://discord.com/developers/applications)
- **OpenAI API Key** from [OpenAI Platform](https://platform.openai.com)
- **Stripe Account** (if using payments)

## Step 1: Clone & Install

```bash
# Clone repository
git clone https://github.com/yourusername/friendmaker.git
cd friendmaker

# Install dependencies
npm install
```

## Step 2: Discord Bot Setup

### Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Name it "FriendMaker" and create
4. Go to "Bot" tab
5. Click "Add Bot"
6. Enable these **Privileged Gateway Intents**:
   - SERVER MEMBERS INTENT
   - MESSAGE CONTENT INTENT
7. Click "Reset Token" and copy the token
8. Go to "OAuth2" → "URL Generator"
9. Select scopes: `bot`, `applications.commands`
10. Select bot permissions:
    - Send Messages
    - Embed Links
    - Read Message History
    - Use Slash Commands
11. Copy the generated URL and invite bot to your test server

### Configure Bot Environment

```bash
cd discord-bot
cp .env.example .env
```

Edit `.env`:

```env
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
MONGODB_URI=mongodb://localhost:27017/friendmaker
REDIS_URL=redis://localhost:6379
WEBSITE_URL=http://localhost:3000
BOT_API_SECRET=generate_random_string_here
NODE_ENV=development
```

### Deploy Commands

```bash
npm run deploy-commands
```

You should see: ✅ Successfully deployed X application commands

## Step 3: Website Setup

### Configure Website Environment

```bash
cd ../website
cp .env.example .env
```

Edit `.env`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
BOT_API_URL=http://localhost:3001
BOT_API_SECRET=same_as_bot_api_secret
MONGODB_URI=mongodb://localhost:27017/friendmaker
REDIS_URL=redis://localhost:6379
NEXTAUTH_SECRET=generate_random_string
NEXTAUTH_URL=http://localhost:3000
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
OPENAI_API_KEY=your_openai_key
STRIPE_SECRET_KEY=sk_test_...
```

### Setup Discord OAuth

1. Go back to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Go to "OAuth2" → "General"
4. Add redirect URL: `http://localhost:3000/api/auth/callback/discord`
5. Copy **CLIENT ID** and **CLIENT SECRET**
6. Paste into `.env`

## Step 4: Database Setup

### Using MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create database user
4. Whitelist your IP (or 0.0.0.0/0 for development)
5. Get connection string
6. Replace in both `.env` files

### Using Local MongoDB

```bash
# Install MongoDB
brew install mongodb-community@8.0  # macOS
# or
sudo apt-get install mongodb  # Ubuntu

# Start MongoDB
mongod --dbpath /path/to/data
```

## Step 5: Redis Setup

### Using Upstash (Recommended)

1. Go to [Upstash](https://upstash.com)
2. Create free Redis database
3. Copy connection URL
4. Replace in both `.env` files

### Using Local Redis

```bash
# Install Redis
brew install redis  # macOS
# or
sudo apt-get install redis-server  # Ubuntu

# Start Redis
redis-server
```

## Step 6: Start Development Servers

### Terminal 1 - Website

```bash
cd website
npm run dev
```

Website running at: http://localhost:3000

### Terminal 2 - Discord Bot

```bash
cd discord-bot
npm run dev
```

Bot API running at: http://localhost:3001

## Step 7: Test the System

### Test Discord Bot

1. Go to your test Discord server
2. Type `/help` - should show command list
3. Type `/signup` - should create account
4. Click the button - should open website

### Test Website

1. Open http://localhost:3000
2. Click "Get Started"
3. Should redirect to Discord OAuth
4. Authorize the app
5. Should redirect back to website

## Common Issues

### Bot Not Responding

- Check bot token is correct
- Ensure bot has proper permissions
- Check bot is online in Discord server
- Run `npm run deploy-commands`

### Database Connection Failed

- Check MongoDB is running
- Verify connection string
- Check IP whitelist (if using Atlas)

### Redis Connection Failed

- Check Redis is running
- Verify connection URL
- Check firewall settings

### Website Won't Start

- Check port 3000 is available
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### OAuth Errors

- Check redirect URL matches exactly
- Verify CLIENT_ID and CLIENT_SECRET
- Check Discord app OAuth settings

## Next Steps

- Read [Architecture Documentation](./architecture.md)
- Review [API Reference](./api.md)
- Check [Database Schema](./database.md)
- See [Deployment Guide](./deployment.md)

## Need Help?

- Join our Discord: [discord.gg/friendmaker](https://discord.gg/friendmaker)
- Check GitHub Issues
- Email: support@friendmaker.app