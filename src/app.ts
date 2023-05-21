import express from 'express';
import connection from "./db/config";
import router from "./routes/router";
import cors from 'cors';
import { Server } from 'socket.io';
import * as http from "http";
import rateLimit from "express-rate-limit";
import swaggerUI from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

const app = express();
const limiter = rateLimit({
    max: 2,
    windowMs: 10000
});
export const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: "http://localhost:3001",
    }
});

require('./socket')(io);

app.use("/persons", limiter, router);
app.use(cors());
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
