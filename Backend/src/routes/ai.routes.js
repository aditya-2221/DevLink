import { Router } from "express";

import {
    generateDescription,
    generateReadme,
    generateReport,
    reviewProject
} from "../controllers/ai.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post(
    "/generate-description",
    generateDescription
);

router.post(
    "/generate-readme",
    generateReadme
);

router.post(
    "/generate-report",
    generateReport
);

router.post(
    "/review-project",
    reviewProject
);

export default router;