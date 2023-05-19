import {RequestHandler} from "express";
import {Persons} from "../interfaces/persons";

export const createPerson: RequestHandler = async (req, res, next) => {
    const persons = await Persons.create({...req.body});
    return res
        .status(200)
        .json({message: "Persons fetched successfully", data: persons});
};
