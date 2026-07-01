import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { attachmentUpload } from "../middlewares/attachmentUpload.middleware.js";

import {
    uploadResource,
    getResources,
    deleteResource,
    incrementDownloads
} from "../controllers/resource.controller.js";

const router = Router();

router.use(verifyJWT);

router.post(
    "/team/:teamId",
    attachmentUpload.array("resources", 20),
    uploadResource
);

router.get(
    "/team/:teamId",
    getResources
);



router.delete(
    "/:resourceId",
    deleteResource
);



router.patch(
    "/:resourceId/download",
    incrementDownloads
);

export default router;