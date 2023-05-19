import { Persons } from "../interfaces/persons";

const getAllPersons = (io : any) => {
    Persons.findAll().then((persons: any) => io.emit('get/persons', persons));
}

module.exports = {
    getAllPersons
}
