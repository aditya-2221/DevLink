import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    likeProject,
    unlikeProject
} from "../controllers/project.controller.js";

const router = Router()

router.route("/")
    .post(
        verifyJWT,
        upload.array("images", 5),
        createProject
    )
    .get(getAllProjects);

router.route("/:projectId")
    .get(getProjectById)
    .patch(
        verifyJWT,
        upload.array("images", 5),
        updateProject
    )
    .delete(
        verifyJWT,
        deleteProject
    );

router.route("/:projectId/like")
    .post(verifyJWT, likeProject)
    .delete(verifyJWT, unlikeProject);

export default router