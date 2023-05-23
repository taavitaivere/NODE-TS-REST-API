import {RequestHandler} from "express";
import {Persons} from "../interfaces/persons";

const jwt = require('jsonwebtoken');
export const createPerson: RequestHandler = async (req, res, next) => {
    try {
        const { name, email, avatar } = req.body;
        const token = req.headers.authorization.split(' ')[1]; // Extract the token from the Authorization header

        if (!name || !email || !avatar || !token) {
            return res.status(400).json({ message: "Name, email, avatar, and token are required fields" });
        }

        // Include the token in the request body
        const persons = await Persons.create({ name, email, avatar, token });

        return res.status(200).json({ message: "Persons created successfully", data: persons });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong" });
    }
};

export const getAllPerson: RequestHandler = async (req, res, next) => {
    const allPersons: Persons[] = await Persons.findAll();

    return res
        .status(200)
        .json(allPersons)

}

export const getPersonById: RequestHandler = async (req, res, next) => {
    const {id} = req.params;
    const person: Persons | null = await Persons.findByPk(id);

    return res.status(200).json({message: "Person fetched successfully", data: person});
}

export const updatePerson: RequestHandler = async (req, res, next) => {
    try {
        await authenticate(req, res, next);
        const {id} = req.params;
        const person: Persons | null = await Persons.findByPk(id);

        if (person) {
            await Persons.update({...req.body}, {where: {id}});
            const updatedPerson: Persons | null = await Persons.findByPk(id);

            return res.status(200).json({message: "Person updated successfully", data: updatedPerson});
        }

    }
    catch (err: any) {
        if (err.message === "auth error") {
            return res.status(403).send();
        }
        return res.status(404).json({message: "Person not found"});
    }
}

export const deletePerson: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedPerson: Persons | null = await Persons.findByPk(id);

        if (!deletedPerson) {
            return res.status(404).json({ message: "Person not found" });
        }

        return res.status(200).json({ message: "Person deleted successfully", data: deletedPerson });
    } catch (err) {
        if (err.message === "auth error") {
            return res.status(403).send();
        }
        return res.status(500).json({ message: "An internal server error occurred" });
    }
};

async function authenticate(req: any, res: any, next: any) {
    const {id} = req.params;
    const uniqueToken = req.headers.authorization.split(' ')[1];

    const personObj: any = await Persons.findByPk(id);

    if (personObj.token !== uniqueToken) {
        throw new Error("auth error");
    }
}
