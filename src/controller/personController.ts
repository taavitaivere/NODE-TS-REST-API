import {RequestHandler} from "express";
import {Persons} from "../interfaces/persons";

const jwt = require('jsonwebtoken');
export const createPerson: RequestHandler = async (req, res, next) => {
    const persons = await Persons.create({...req.body});
    return res
        .status(200)
        .json({message: "Persons fetched successfully", data: persons});
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

    return {name: person?.name, email: person?.email, avatar: person?.avatar};
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
        await authenticate(req, res, next);
        const {id} = req.params;
        const deletedPerson: Persons | null = await Persons.findByPk(id);

        await Persons.destroy({where: {id}});

        return res.status(200).json({message: "Person deleted successfully", data: deletedPerson});
    }
    catch (err: any) {
        if (err.message === "auth error") {
            return res.status(403).send();
        }
        return res.status(404).json({message: "Person not found"});
    }
}

async function authenticate(req: any, res: any, next: any) {
    const {id} = req.params;
    const uniqToken = req.headers.authorization.split(' ')[1];

    const personObj: any = await Persons.findByPk(id);

    if (personObj.token !== uniqToken) {
        throw new Error("auth error");
    }
}
