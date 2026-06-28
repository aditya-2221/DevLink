import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    moveTask,
    assignTask,
    deleteTask,
    getTaskActivities
} from "../controllers/task.controller.js";

const router = Router();

router.use(verifyJWT);


router.post("/", createTask);

router.get("/team/:teamId", getTasks);

router.get("/:taskId", getTaskById);

router.patch("/:taskId", updateTask);

router.patch("/:taskId/status", moveTask);

router.patch("/:taskId/assign", assignTask);

router.get("/:taskId/activity", getTaskActivities);

router.delete("/:taskId", deleteTask);

export default router;