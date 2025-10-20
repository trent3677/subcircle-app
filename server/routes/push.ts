import { Router, Request, Response } from 'express';
import { db } from '../db';
import { webPushSubscriptions } from '../../shared/schema';
import { eq, and } from 'drizzle-orm';

const router = Router();

// Get VAPID public key
router.get('/public-key', (req: Request, res: Response) => {
  try {
    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
    
    if (!vapidPublicKey) {
      console.error("VAPID_PUBLIC_KEY not configured");
      return res.status(500).json({ error: "Push notifications not configured" });
    }

    console.log("Returning VAPID public key");
    
    res.json({ 
      publicKey: vapidPublicKey,
      success: true 
    });
  } catch (error: any) {
    console.error("Error in push-get-public-key:", error);
    res.status(500).json({ error: error.message });
  }
});

// Subscribe to push notifications
router.post('/subscribe', async (req: Request, res: Response) => {
  try {
    // For now, we'll use a simple user ID from headers or body
    // In a real app, this would come from JWT authentication
    const userId = req.headers['x-user-id'] as string || req.body.userId;
    
    if (!userId) {
      return res.status(401).json({ error: "User ID required" });
    }

    const { endpoint, keys, userAgent } = req.body;
    
    if (!endpoint || !keys?.auth || !keys?.p256dh) {
      return res.status(400).json({ error: "Missing required subscription data" });
    }

    console.log("Storing push subscription for user:", userId);

    // Store subscription in database (upsert to handle multiple subscriptions)
    const result = await db.insert(webPushSubscriptions)
      .values({
        userId,
        endpoint,
        p256dhKey: keys.p256dh,
        authKey: keys.auth,
        userAgent: userAgent || null,
      })
      .onConflictDoUpdate({
        target: [webPushSubscriptions.userId, webPushSubscriptions.endpoint],
        set: {
          p256dhKey: keys.p256dh,
          authKey: keys.auth,
          userAgent: userAgent || null,
          updatedAt: new Date(),
        }
      })
      .returning();

    console.log("Push subscription stored successfully:", result[0].id);

    res.json({ 
      success: true,
      subscriptionId: result[0].id 
    });
  } catch (error: any) {
    console.error("Error in push-subscribe:", error);
    res.status(500).json({ error: error.message });
  }
});

// Unsubscribe from push notifications
router.post('/unsubscribe', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string || req.body.userId;
    
    if (!userId) {
      return res.status(401).json({ error: "User ID required" });
    }

    const { endpoint } = req.body;
    
    if (!endpoint) {
      return res.status(400).json({ error: "Endpoint is required" });
    }

    console.log("Removing push subscription for user:", userId, "endpoint:", endpoint);

    // Remove subscription from database
    await db.delete(webPushSubscriptions)
      .where(and(
        eq(webPushSubscriptions.userId, userId),
        eq(webPushSubscriptions.endpoint, endpoint)
      ));

    console.log("Push subscription removed successfully");

    res.json({ success: true });
  } catch (error: any) {
    console.error("Error in push-unsubscribe:", error);
    res.status(500).json({ error: error.message });
  }
});

// Send test push notification
router.post('/send-test', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string || req.body.userId;
    
    if (!userId) {
      return res.status(401).json({ error: "User ID required" });
    }

    console.log("Sending test push notification to user:", userId);

    // Get user's push subscriptions
    const subscriptions = await db.select()
      .from(webPushSubscriptions)
      .where(eq(webPushSubscriptions.userId, userId));

    if (!subscriptions || subscriptions.length === 0) {
      return res.status(404).json({ error: "No push subscriptions found" });
    }

    // For now, just return success without actually sending
    // In a real implementation, you'd use a push notification service
    console.log(`Found ${subscriptions.length} subscriptions for user ${userId}`);

    res.json({
      success: true,
      sent: subscriptions.length,
      failed: 0,
      total: subscriptions.length
    });
  } catch (error: any) {
    console.error("Error in push-send-test:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;