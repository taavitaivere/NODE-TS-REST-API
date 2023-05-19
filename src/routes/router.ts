import {Router} from "express";

import {
    createPerson,
    getAllPerson
} from "../controller/personController";

const router = Router();

router.post("/", createPerson);
router.get("/", getAllPerson);

export default router;
