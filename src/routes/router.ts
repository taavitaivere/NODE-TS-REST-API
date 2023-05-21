import {Router} from "express";

import {
    createPerson,
    getAllPerson,
    getPersonById,
    updatePerson,
    deletePerson
} from "../controller/personController";

const router = Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

router.post("/", [verifyToken], createPerson);
router.get("/", getAllPerson);
router.get("/:id", getPersonById);
router.put("/:id", [verifyToken], updatePerson);
router.delete("/:id", [verifyToken], deletePerson);

function verifyToken(req : any, res : any, next : any) {
    const authHeader = req.headers['authorization'];

    if (typeof authHeader !== 'undefined') {
        const token = authHeader.split(' ')[1];
        const privateKey = process.env.KEY;

        jwt.verify(token, privateKey, {algorithm: 'HS256'}, (err : any) => {
            if (err) {
                res.status(401).json({message: "invalid token"});
                throw new Error("Unauthorized");
            }
            return next();
        })
    } else {
        res.status(401).json({message: "include token"});
        throw new Error("include token");
    }
}
export default router;
