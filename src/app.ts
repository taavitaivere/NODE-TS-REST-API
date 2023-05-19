import express from 'express';
import connection from "./db/config";

const app = express();

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

app.listen(3000);
