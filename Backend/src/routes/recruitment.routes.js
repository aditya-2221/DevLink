import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
    createRecruitment,
    getAllRecruitments,
    getRecruitmentById,
    updateRecruitment,
    deleteRecruitment,
    applyToRecruitment,
    getRecruitmentApplications,
    acceptApplication,
    rejectApplication,
    getMyRecruitments,
    getMyApplications,
    getRecruitmentSkills
} from "../controllers/recruitment.controller.js";

const router = Router();

router.use(verifyJWT);

router.post("/", createRecruitment);

router.get("/", getAllRecruitments);

router.get(
    "/my-recruitments",
    getMyRecruitments
)

router.get(
    "/my-applications",
    getMyApplications
)
router.get(
    "/skills",
    getRecruitmentSkills
);

router.get("/:recruitmentId", getRecruitmentById);

router.patch("/:recruitmentId", updateRecruitment);

router.delete("/:recruitmentId", deleteRecruitment);


router.post(
    "/:recruitmentId/apply",
    applyToRecruitment
);

router.get(
    "/:recruitmentId/applications",
    getRecruitmentApplications
);

router.patch(
    "/applications/:applicationId/accept",
    acceptApplication
);

router.patch(
    "/applications/:applicationId/reject",
    rejectApplication
);

export default router;