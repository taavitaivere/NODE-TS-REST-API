import {Router} from "express";

import {
    createPerson,
    deletePerson,
    getAllPerson,
    getPersonById,
    updatePerson
} from "../controller/personController";

const router = Router();

router.post("/", createPerson);
router.get("/", getAllPerson);
router.get("/:id", getPersonById);
router.put("/:id", updatePerson);
router.delete("/:id", deletePerson);

export default router;
