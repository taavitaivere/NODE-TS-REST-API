
const {Persons} = require('../interfaces/persons');

const getAllPersons = (io : any) => {
    Persons.findAll().then((persons: any) => io.emit('get/persons', persons));
}

const createPerson = (io: { emit: (arg0: string, arg1: any) => any; }, data: any) => {
    Persons.create(data).then(() => getAllPersons(io));
}

const deletePerson = (io: { emit: (arg0: string, arg1: any) => any; }, id: any) => {
    Persons.destroy({where: {id}}).then(() => getAllPersons(io));
}

const updatePerson = (io: { emit: (arg0: string, arg1: any) => any; }, data: { id: any; }) => {
    Persons.update(data, {where: {id: data.id}}).then(() => getAllPersons(io));
}

module.exports = {
    getAllPersons,
    createPerson,
    deletePerson,
    updatePerson
}
