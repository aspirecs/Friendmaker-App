# FriendMaker Deployment Guide

## Deployment Architecture

```
┌─────────────────────────────────────────────┐
│  Website (Vercel)                            │
│  friendmaker.app                             │
└─────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  Shared Services                             │
│  - MongoDB Atlas                             │
│  - Upstash Redis                             │
│  - Cloudflare R2                             │
└─────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  Discord Bot (Railway)                       │
│  bot-api.friendmaker.app                     │
└─────────────────────────────────────────────┘
```

## Prerequisites

- Domain name (e.g., friendmaker.app)
- Vercel account
- Railway/Render account
- MongoDB Atlas cluster
- Upstash Redis database
- Cloudflare account (for R2)

## Part 1: Deploy Website to Vercel

### Step 1: Connect GitHub Repository

1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the `website` directory as root

### Step 2: Configure Build Settings

```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Root Directory: website
```

### Step 3: Add Environment Variables

In Vercel project settings → Environment Variables:

```env
NEXT_PUBLIC_APP_URL=https://friendmaker.app
BOT_API_URL=https://bot-api.friendmaker.app
BOT_API_SECRET=your_production_secret
MONGODB_URI=mongodb+srv://...
REDIS_URL=rediss://...
NEXTAUTH_SECRET=your_production_secret
NEXTAUTH_URL=https://friendmaker.app
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...
OPENAI_API_KEY=...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
EMAIL_FROM=noreply@friendmaker.app
RESEND_API_KEY=...
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
SENTRY_DSN=...
NODE_ENV=production
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Visit your deployment URL

### Step 5: Custom Domain

1. Go to Settings → Domains
2. Add your domain: `friendmaker.app`
3. Add DNS records as instructed:

```
A     @     76.76.21.21
CNAME www   cname.vercel-dns.com
```

4. Wait for DNS propagation (5-30 minutes)

## Part 2: Deploy Discord Bot to Railway

### Step 1: Create Railway Project

1. Go to [Railway](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository

### Step 2: Configure Service

1. Set Root Directory: `discord-bot`
2. Add Build Command: `npm run build`
3. Add Start Command: `npm start`

### Step 3: Add Environment Variables

```env
DISCORD_BOT_TOKEN=your_production_bot_token
DISCORD_CLIENT_ID=...
MONGODB_URI=mongodb+srv://...
REDIS_URL=rediss://...
WEBSITE_URL=https://friendmaker.app
BOT_API_PORT=3001
BOT_API_SECRET=same_as_website
NODE_ENV=production
```

### Step 4: Expose Public URL

1. Go to Settings → Networking
2. Generate Domain
3. Copy the URL (e.g., `bot-api.up.railway.app`)
4. (Optional) Add custom domain: `bot-api.friendmaker.app`

### Step 5: Update Website Environment

Go back to Vercel and update:

```env
BOT_API_URL=https://bot-api.friendmaker.app
```

Redeploy the website.

## Part 3: Database Setup

### MongoDB Atlas

1. Create production cluster (M10+ recommended)
2. Create database user with strong password
3. Whitelist Railway and Vercel IPs:
   - Go to Network Access
   - Add Railway IP ranges
   - Add Vercel IP ranges (or 0.0.0.0/0 if dynamic)
4. Get connection string
5. Replace in both services

### Upstash Redis

1. Create production Redis database
2. Enable TLS
3. Copy connection URL (starts with `rediss://`)
4. Replace in both services

## Part 4: Discord Bot Configuration

### Update Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Update OAuth2 redirect URLs:
   - `https://friendmaker.app/api/auth/callback/discord`
4. Update bot token if needed

### Deploy Commands to Production

```bash
cd discord-bot
DISCORD_BOT_TOKEN=your_prod_token npm run deploy-commands
```

## Part 5: Stripe Configuration

### Setup Webhooks

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Developers → Webhooks
3. Add endpoint: `https://friendmaker.app/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy webhook secret
6. Add to Vercel environment variables

### Update Payment Links

1. Create products in Stripe
2. Update pricing page with live price IDs

## Part 6: Email Configuration

### Setup Resend

1. Go to [Resend](https://resend.com)
2. Add domain: `friendmaker.app`
3. Add DNS records (SPF, DKIM, DMARC)
4. Verify domain
5. Create API key
6. Add to Vercel environment variables

## Part 7: File Storage (Cloudflare R2)

### Setup R2 Bucket

1. Go to Cloudflare Dashboard
2. R2 → Create bucket: `friendmaker-uploads`
3. Create API token with R2 permissions
4. Add credentials to Vercel environment variables

### Configure CORS

```json
[
  {
    "AllowedOrigins": ["https://friendmaker.app"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"]
  }
]
```

## Part 8: Monitoring & Error Tracking

### Setup Sentry

1. Go to [Sentry](https://sentry.io)
2. Create new project (Next.js)
3. Copy DSN
4. Add to Vercel environment variables
5. Errors will be tracked automatically

### Setup Health Checks

1. Create uptime monitor (e.g., Better Stack)
2. Monitor endpoints:
   - `https://friendmaker.app/api/health`
   - `https://bot-api.friendmaker.app/api/bot/status`

## Part 9: Security Checklist

- [ ] All secrets are production-ready (not dev/test)
- [ ] NEXTAUTH_SECRET is random and secure
- [ ] BOT_API_SECRET matches between services
- [ ] Stripe uses live keys (not test)
- [ ] Database has strong password
- [ ] Database IP whitelist is configured
- [ ] Redis has TLS enabled
- [ ] Discord OAuth URLs are correct
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled

## Part 10: Testing Production

### Test Website

1. Visit https://friendmaker.app
2. Click "Get Started"
3. Complete OAuth flow
4. Test all features

### Test Discord Bot

1. Invite bot to server using production invite
2. Run `/signup`
3. Verify it connects to production website
4. Test all commands

### Test Payments (if enabled)

1. Use Stripe test mode first
2. Complete a test purchase
3. Verify webhook is received
4. Check subscription is created
5. Switch to live mode

## Part 11: Post-Deployment

### Enable Analytics

1. Add Google Analytics (if desired)
2. Setup custom events tracking
3. Monitor user behavior

### Setup Backups

1. MongoDB Atlas: Enable continuous backups
2. Export critical data regularly
3. Test restore procedures

### Documentation

1. Update README with production URLs
2. Document any custom configurations
3. Create runbooks for common issues

## Troubleshooting

### Website Build Fails

- Check environment variables
- Verify all dependencies are in package.json
- Check build logs in Vercel

### Bot Not Responding

- Check Railway logs
- Verify bot token is correct
- Ensure bot is online in Discord

### Database Connection Issues

- Verify IP whitelist
- Check connection string
- Test connection locally first

### OAuth Not Working

- Verify redirect URLs match exactly
- Check client ID and secret
- Ensure cookies are enabled

## Monitoring Production

### Key Metrics to Track

- Website uptime
- Bot uptime
- Database response time
- API response time
- Error rate
- User signups
- Active users

### Recommended Tools

- Vercel Analytics (built-in)
- Railway Metrics (built-in)
- Sentry (error tracking)
- Better Stack (uptime monitoring)
- MongoDB Atlas Monitoring

## Scaling Considerations

### When to Scale

- Website: Auto-scales with Vercel
- Bot: Upgrade Railway plan when needed
- Database: Upgrade to M20+ for >10k users
- Redis: Upgrade plan for >100k requests/day

### Performance Optimization

- Enable CDN caching
- Optimize images
- Use database indexes
- Cache frequently accessed data
- Implement rate limiting

## Support

If you encounter issues during deployment:

- Check Railway/Vercel logs
- Review MongoDB/Redis connection logs
- Join our Discord for support
- Create GitHub issue with details

---

**Congratulations! 🎉**

Your FriendMaker application is now live in production!