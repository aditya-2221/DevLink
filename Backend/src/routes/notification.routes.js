import { Router } from "express";

import {
    getMyNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
} from "../controllers/notification.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get(
    "/",
    getMyNotifications
);

router.patch(
    "/read-all",
    markAllNotificationsAsRead
);

router.patch(
    "/:notificationId/read",
    markNotificationAsRead
);

router.delete(
    "/:notificationId",
    deleteNotification
);

export default router;