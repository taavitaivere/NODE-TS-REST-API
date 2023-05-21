import express, { Request, Response, NextFunction } from 'express';
import router from "./routes/router";
import connection from "./db/config";
import { urlencoded, json } from 'body-parser';
import swaggerUI from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import cors from 'cors';
import { Server } from 'socket.io';
import * as http from "http";
import rateLimit from "express-rate-limit";

const app = express();
const jwt = require('jsonwebtoken');

const limiter = rateLimit({
    max: 10,
    windowMs: 10000
});

export const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: "http://localhost:3001",
    }
});

require('./socket')(io);

app.use(json());
app.use(cors());

app.use ((err, req, res, next) => {
    if (err.code === 'ERR_HTTP_HEADERS_SENT') {
        return next(err);
    }
});



app.use(urlencoded({extended: true}));

app.use("/persons", limiter, router);

app.use('/token', (req, res) => {
    let privateKey = process.env.KEY;
    let token = jwt.sign({"body" : "stuff"}, privateKey, {algorithm: 'HS256'});
    console.log(token);
    res.send(token);
});


app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use((
    err: Error,
    req:express.Request,
    res:express.Response,
    next:express.NextFunction
) => {
    res.status(404).json({message:err.message});
});

connection.sync({force: true}).then(() => {
    console.log("Database synced");
}).catch((err) => {
    console.log("Err", err);
});
server.listen(3000);
