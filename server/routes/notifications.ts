import { Router, Request, Response } from 'express';
import { db } from '../db';
import { notifications, notificationPreferences } from '../../shared/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// Send notification email (simplified version)
router.post('/send-email', async (req: Request, res: Response) => {
  try {
    const { to, type, title, message, priority, user_id } = req.body;
    
    if (!to || !title || !message) {
      return res.status(400).json({ error: "Missing required fields: to, title, message" });
    }

    // If user_id is provided, check their preferences
    if (user_id) {
      const preferences = await db.select()
        .from(notificationPreferences)
        .where(eq(notificationPreferences.userId, user_id))
        .limit(1);

      if (preferences.length > 0 && !preferences[0].emailEnabled) {
        console.log('Email notifications disabled for user, skipping...');
        return res.json({ 
          success: true, 
          skipped: true,
          reason: 'Email notifications disabled'
        });
      }
    }

    // For now, just log the email that would be sent
    console.log("Would send notification email:", { to, type, title, priority });

    res.json({ 
      success: true, 
      message: "Email notification logged (not actually sent in demo)" 
    });
  } catch (error: any) {
    console.error("Error in send-notification-email:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get user notifications
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const userNotifications = await db.select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(notifications.createdAt);

    res.json({ success: true, notifications: userNotifications });
  } catch (error: any) {
    console.error("Error getting notifications:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create notification
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, type, title, message, data, priority, category, actionUrl } = req.body;

    if (!userId || !type || !title || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await db.insert(notifications)
      .values({
        userId,
        type,
        title,
        message,
        data: data || null,
        priority: priority || 'low',
        category: category || 'system',
        actionUrl: actionUrl || null,
      })
      .returning();

    res.json({ success: true, notification: result[0] });
  } catch (error: any) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;