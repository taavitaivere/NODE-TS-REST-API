import { Persons } from "../interfaces/persons";

const getAllPersons = (io : any) => {
    Persons.findAll().then((persons: any) => io.emit('get/persons', persons));
}

const createPerson = (io: { emit: (arg0: string, arg1: any) => any; }, data: any) => {
    Persons.create(data).then(() => getAllPersons(io));
}


module.exports = {
    getAllPersons,
    createPerson
}
