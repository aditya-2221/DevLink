import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createProject, getAllProjects, getProjectById, updateProject,
    deleteProject, likeProject, unlikeProject, addComment, allComments, updateComment,
    deleteComment, addBookmark, removeBookmark, getTrendingProjects,getMyProjects,getProjectsByUsername
} from "../controllers/project.controller.js";

const router = Router();

router.route("/")
    .post(
        verifyJWT,
        upload.array("images", 5),
        createProject
    )
    .get(verifyJWT, getAllProjects);

router.route("/trending").get(getTrendingProjects)
router.get(
    "/my-projects",
    verifyJWT,
    getMyProjects
);

router.get(
    "/user/:username",
    verifyJWT,
    getProjectsByUsername
)

router.route("/:projectId")
    .get(verifyJWT, getProjectById)
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

router.route("/:projectId/bookmark")
    .post(verifyJWT, addBookmark)
    .delete(verifyJWT, removeBookmark);

router.route("/:projectId/comments")
    .post(verifyJWT, addComment)
    .get(verifyJWT, allComments);

router.route("/comments/:commentId")
    .patch(verifyJWT, updateComment)
    .delete(verifyJWT, deleteComment);

export default router;