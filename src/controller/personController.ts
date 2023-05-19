import {RequestHandler} from "express";
import {Persons} from "../interfaces/persons";

export const createPerson: RequestHandler = async (req, res, next) => {
    const persons = await Persons.create({...req.body});
    return res
        .status(200)
        .json({message: "Persons fetched successfully", data: persons});
};
export const getAllPerson: RequestHandler = async (req, res, next) => {
    const allPersons: Persons[] = await Persons.findAll();

    return res.status(200).json({message: "All persons fetched successfully", data: allPersons});
}

export const getPersonById: RequestHandler = async (req, res, next) => {
    const {id} = req.params;
    const person: Persons | null = await Persons.findByPk(id);

    return res.status(200).json({message: "Person fetched successfully", data: person});
}

export const updatePerson: RequestHandler = async (req, res, next) => {
    const {id} = req.params;
    const person: Persons | null = await Persons.findByPk(id);

    if (person) {
        await Persons.update({...req.body}, {where: {id}});
        const updatedPerson: Persons | null = await Persons.findByPk(id);

        return res.status(200).json({message: "Person updated successfully", data: updatedPerson});
    }

    return res.status(404).json({message: "Person not found"});
}

export const deletePerson: RequestHandler = async (req, res, next) => {
    const {id} = req.params;
    const deletedPerson: Persons | null = await Persons.findByPk(id);

    await Persons.destroy({where: {id}});

    return res.status(200).json({message: "Person deleted successfully", data: deletedPerson});
}
