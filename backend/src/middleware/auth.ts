import { Request, Response, NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { PrismaClient } from '../../generated/prisma';
import { config } from '@src/config/environment';

const client = new OAuth2Client();
const prisma = new PrismaClient();

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email?: string;
      };
    }
  }
}

export async function verifyAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No valid authorization header' });
    }

    const token = authHeader.substring(7);
    
    // Verify the Google JWT token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: config.google.clientId,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const googleId = payload.sub;
    
    // Check if user exists in database
    const user = await prisma.user.findUnique({
      where: { id: googleId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Attach user to request object
    req.user = {
      id: user.id,
      name: user.name,
      email: payload.email || undefined
    };

    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({ error: 'Authentication failed' });
  }
}
