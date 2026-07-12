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

    inviteMember,
    getMyInvitations,
    acceptInvitation,
    rejectInvitation,
    getPendingInvitations,
    cancelInvitation,

    createAnnouncement,
    getAnnouncements,
    updateAnnouncement,
    togglePinAnnouncement,
    deleteAnnouncement
} from "../controllers/team.controller.js";

const router = Router();

router.use(verifyJWT);

router.post("/", createTeam);

router.get("/my-teams", getMyTeams);

router.get("/invitations", getMyInvitations);

router.patch(
    "/invitations/:invitationId/accept",
    acceptInvitation
);
router.delete(
    "/invitations/:invitationId",
    cancelInvitation
);

router.patch(
    "/invitations/:invitationId/reject",
    rejectInvitation
);

router.get(
    "/:teamId/invitations",
    getPendingInvitations
);

router.get("/:teamId", getTeamById);

router.patch("/:teamId", updateTeam);

router.delete("/:teamId", deleteTeam);

router.post("/:teamId/members", addMember);

router.delete(
    "/:teamId/members/:userId",
    removeMember
);

router.post(
    "/:teamId/invite",
    inviteMember
);

router.post(
    "/:teamId/announcements",
    createAnnouncement
);

router.get(
    "/:teamId/announcements",
    getAnnouncements
);

router.patch(
    "/:teamId/announcements/:announcementId",
    updateAnnouncement
);

router.patch(
    "/:teamId/announcements/:announcementId/pin",
    togglePinAnnouncement
);

router.delete(
    "/:teamId/announcements/:announcementId",
    deleteAnnouncement
);

export default router;