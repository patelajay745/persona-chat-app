import { Router } from "express";
import { streamReply } from "./persona.controller";

const router = Router();

router.post("/:persona", streamReply);

export default router;
