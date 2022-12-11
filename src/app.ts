import express from 'express';
import router from "./routes/router";
import connection from "./db/config";
import { urlencoded, json } from 'body-parser';
import swaggerUI from 'swagger-ui-express';

const app = express();

app.use(json());

app.use(urlencoded({extended: true}));

app.use("/persons", router);

app.use(
    "/docs",
    swaggerUI.serve,
    swaggerUI.setup(undefined, {
        swaggerOptions: {
            url: "/swagger.json",
        },
    })
);

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
