import { Router } from 'express';
import pushRoutes from './push';
import notificationRoutes from './notifications';
import { isAuthenticated } from '../replitAuth';
import { storage } from '../storage';

const router = Router();

// Auth routes
router.get('/auth/user', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const user = await storage.getUser(userId);
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

// Push notification routes
router.use('/push', pushRoutes);

// Notification routes  
router.use('/notifications', notificationRoutes);

export default router;