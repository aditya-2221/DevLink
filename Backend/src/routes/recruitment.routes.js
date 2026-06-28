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

router.get("/", getAllRecruitments);

router.get("/skills", getRecruitmentSkills);

router.get(
    "/my-recruitments",
    verifyJWT,
    getMyRecruitments
);

router.get(
    "/my-applications",
    verifyJWT,
    getMyApplications
);

router.post(
    "/",
    verifyJWT,
    createRecruitment
);

router.get(
    "/:recruitmentId",
    getRecruitmentById
);

router.patch(
    "/:recruitmentId",
    verifyJWT,
    updateRecruitment
);

router.delete(
    "/:recruitmentId",
    verifyJWT,
    deleteRecruitment
);

router.post(
    "/:recruitmentId/apply",
    verifyJWT,
    applyToRecruitment
);

router.get(
    "/:recruitmentId/applications",
    verifyJWT,
    getRecruitmentApplications
);

router.patch(
    "/applications/:applicationId/accept",
    verifyJWT,
    acceptApplication
);

router.patch(
    "/applications/:applicationId/reject",
    verifyJWT,
    rejectApplication
);

export default router