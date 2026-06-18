import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
    createTeam,
    getMyTeams,
    getTeamById,
    updateTeam,
    deleteTeam,
    addMember,
    removeMember,
    createAnnouncement
} from "../controllers/team.controller.js";

const router = Router();

router.use(verifyJWT);


router.post("/", createTeam);

router.get("/my-teams", getMyTeams);

router.get("/:teamId", getTeamById);

router.patch("/:teamId", updateTeam);

router.delete("/:teamId", deleteTeam);


router.post("/:teamId/members", addMember);

router.delete("/:teamId/members/:userId", removeMember);


router.post("/:teamId/announcements", createAnnouncement);

export default router;