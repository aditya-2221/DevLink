import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { globalSearch } from "../controllers/search.controller.js";

const router = Router();

router.get(
    "/",
    verifyJWT,
    globalSearch
);

export default router;