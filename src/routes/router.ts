import {Router} from "express";
import { createPerson } from "../controller/personController";

const router = Router();

router.post("/", createPerson);

export default router;
