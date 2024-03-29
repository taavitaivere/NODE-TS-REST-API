import { Sequelize } from "sequelize-typescript";
import {Persons} from "../interfaces/persons";

const connection = new Sequelize({
    dialect: "mysql",
    host: "localhost",
    username: "root",
    password: "",
    database: "reactdb",
    models: [Persons],
    logging: false
});

export default connection;
