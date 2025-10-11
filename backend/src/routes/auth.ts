import { Request, Response, NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { PrismaClient } from '../../generated/prisma';
import { config } from '@src/config/environment';

const client = new OAuth2Client();
const prisma = new PrismaClient();

export default {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { credential } = req.body as { credential: string };
      
      if (!credential) {
        return res.status(400).json({ error: 'Credential is required' });
      }

      // Verify the Google JWT token
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: config.google.clientId, // Should match your frontend client ID
      });

      const payload = ticket.getPayload();
      if (!payload) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      const googleId = payload.sub;
      const email = payload.email;
      const name = payload.name;

      if (!googleId) {
        return res.status(401).json({ error: 'No Google ID found in token' });
      }

      // Check if user exists, if not create them
      let user = await prisma.user.findUnique({
        where: { id: googleId }
      });

      if (!user) {
        // Create new user with Google ID as the user ID
        user = await prisma.user.create({
          data: {
            id: googleId,
            name: name || email || 'Unknown User'
          }
        });
      } else {
        // Update user name in case it changed
        if (name && user.name !== name) {
          user = await prisma.user.update({
            where: { id: googleId },
            data: { name }
          });
        }
      }

      // Return user information (without sensitive data)
      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: email
        }
      });

    } catch (err) {
      console.error('Auth error:', err);
      return next(err);
    }
  },

  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No valid authorization header' });
      }

      const token = authHeader.substring(7);
      
      // Verify the token
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: config.google.clientId,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      const googleId = payload.sub;
      
      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: googleId }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: payload.email
        }
      });

    } catch (err) {
      console.error('Token verification error:', err);
      return next(err);
    }
  }
};
