import {Router} from "express";

import {
    createPerson,
    getAllPerson,
    getPersonById,
    updatePerson,
    deletePerson
} from "../controller/personController";

const router = Router();

router.post("/", createPerson);
router.get("/", getAllPerson);
router.get("/:id", getPersonById);
router.put("/:id", updatePerson);
router.delete("/:id", deletePerson);

export default router;
