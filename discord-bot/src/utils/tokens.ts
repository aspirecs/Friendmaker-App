import crypto from 'crypto';

const SECRET = process.env.BOT_API_SECRET || 'your-secret-key';

export function generateSignupToken(userId: string): string {
  const payload = JSON.stringify({
    userId,
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  });
  
  const token = Buffer.from(payload).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(token)
    .digest('base64url');
  
  return `${token}.${signature}`;
}

export function verifySignupToken(token: string): { userId: string } | null {
  try {
    const [payload, signature] = token.split('.');
    
    const expectedSignature = crypto
      .createHmac('sha256', SECRET)
      .update(payload)
      .digest('base64url');
    
    if (signature !== expectedSignature) {
      return null;
    }
    
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    
    if (data.exp < Date.now()) {
      return null;
    }
    
    return { userId: data.userId };
  } catch {
    return null;
  }
}