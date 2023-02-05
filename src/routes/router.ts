import {Router} from "express";
import {check, validationResult} from "express-validator";
import {
    createPerson,
    deletePerson,
    getAllPerson,
    getPersonById,
    updatePerson
} from "../controller/personController";

const router = Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const fs = require('fs');
const circularJSON = require('circular-json');
dotenv.config();

router.get("/log", async (req: any, res: any) => {
    const lines = [];
    const lineReader = require('readline').createInterface({
        input: require('fs').createReadStream('log.txt'),
        crlfDelay: Infinity
    });

    for await (const line of lineReader) {
        const fields = line.match(/(\\.|[^,])+/g);
        lines.push({
            timestamp: fields[0],
            originalUrl: fields[1],
            method: fields[2],
            clientId: fields[3],
            dataDiff: fields[4],
            body: fields[5]
        });
    }
    res.send(lines);
    return res.status(200);
});

router.post("/", createPerson);
router.get("/", getAllPerson);
router.get("/:id", getPersonById);
router.put("/:id", updatePerson);
router.delete("/:id", deletePerson);

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

async function log(req : any, res : any, next : any) {
    const timeStamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

    let token = req.headers.authorization;
    const [header, payload, signature] = token.split('.');

    let dataDiff : any;
    let body : any;

    if (req.method === 'PUT') {
        dataDiff = circularJSON.stringify(diff(req.body, (await getPersonById(req, res, next)))[0]).replace(/[{\"\",}]+/g, " ");
    }

    if (req.method === "POST") {

        body = circularJSON.stringify(req.body).replace(/[{\"\",}]+/g, " ");
    }

    fs.appendFile('log.txt', timeStamp + "," + req.originalUrl + "," + req.method + "," + signature + "," + dataDiff + "," + body + "\r\n", function (err : any) {
        if (err) throw err;
        console.log('Saved!');
    });
    next();
}

function diff(newData : any, oldData : any) {
    function getUniqueKey(newData : any, oldData : any) {
        const keys = Object.keys(newData).concat(Object.keys(oldData));
        return keys.filter(function (item, pos) {
            return keys.indexOf(item) === pos;
        });
    }

    const intialObj : any = {};
    const result : any = {};
    const reference = [] as any;

    for (const key of getUniqueKey(newData, oldData)) {
        if (newData[key] !== oldData[key]) {
            intialObj[key] = oldData[key];
            result[key] = newData[key];
        }
    }
    reference.push(intialObj, result);
    return reference;
}

export default router;
