import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  discordId: string;
  username: string;
  discriminator: string;
  avatar: string;
  email?: string;
  age?: number;
  gender?: string;
  
  personality?: {
    mbti?: string;
    bigFive?: {
      openness: number;
      conscientiousness: number;
      extraversion: number;
      agreeableness: number;
      neuroticism: number;
    };
  };
  
  interests: string[];
  bio?: string;
  
  communicationStyle?: string;
  
  socialEnergy?: {
    socialBattery: number;
    preferredGroupSize: string;
    activityIntensity: string;
    rechargeMethod: string;
  };
  
  gaming?: {
    platforms: string[];
    currentGames: string[];
    playStyle: string;
  };
  
  subscription: {
    tier: 'free' | 'premium' | 'ultra';
    status: 'active' | 'cancelled' | 'expired';
    currentPeriodEnd?: Date;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
  };
  
  usage: {
    dailyMatches: number;
    weeklyRequests: number;
    dailyInstantSessions: number;
    lastReset: Date;
  };
  
  privacySettings: {
    profileViews: {
      visibility: string;
      historyLimit: string;
      showViewsTo: {
        mutualMatches: boolean;
        sentRequests: boolean;
        receivedRequests: boolean;
        discoverFeed: boolean;
      };
    };
  };
  
  profileComplete: boolean;
  onboardingStep: string;
  
  discordServers: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  discordId: { type: String, required: true, unique: true, index: true },
  username: { type: String, required: true },
  discriminator: String,
  avatar: String,
  email: String,
  age: Number,
  gender: String,
  
  personality: {
    mbti: String,
    bigFive: {
      openness: Number,
      conscientiousness: Number,
      extraversion: Number,
      agreeableness: Number,
      neuroticism: Number
    }
  },
  
  interests: [String],
  bio: String,
  
  communicationStyle: String,
  
  socialEnergy: {
    socialBattery: Number,
    preferredGroupSize: String,
    activityIntensity: String,
    rechargeMethod: String
  },
  
  gaming: {
    platforms: [String],
    currentGames: [String],
    playStyle: String
  },
  
  subscription: {
    tier: { type: String, enum: ['free', 'premium', 'ultra'], default: 'free' },
    status: { type: String, enum: ['active', 'cancelled', 'expired'], default: 'active' },
    currentPeriodEnd: Date,
    stripeCustomerId: String,
    stripeSubscriptionId: String
  },
  
  usage: {
    dailyMatches: { type: Number, default: 0 },
    weeklyRequests: { type: Number, default: 0 },
    dailyInstantSessions: { type: Number, default: 0 },
    lastReset: { type: Date, default: Date.now }
  },
  
  privacySettings: {
    profileViews: {
      visibility: { type: String, default: 'matches_only' },
      historyLimit: { type: String, default: '30_days' },
      showViewsTo: {
        mutualMatches: { type: Boolean, default: true },
        sentRequests: { type: Boolean, default: true },
        receivedRequests: { type: Boolean, default: false },
        discoverFeed: { type: Boolean, default: false }
      }
    }
  },
  
  profileComplete: { type: Boolean, default: false },
  onboardingStep: { type: String, default: 'start' },
  
  discordServers: [String],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

UserSchema.index({ interests: 1 });
UserSchema.index({ 'personality.mbti': 1 });
UserSchema.index({ 'subscription.tier': 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);