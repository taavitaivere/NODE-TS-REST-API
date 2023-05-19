const { getAllPersons, createPerson, updatePerson, deletePerson} = require('../controller/socketController');

module.exports = (io: { on: (arg0: string, arg1: (arg0: any) => void) => void; }) => {

    io.on('connection', (socket: { on: (arg0: string, arg1: (arg0: any) => void) => void; }) => {

        socket.on('get/persons', () => getAllPersons(io));

        socket.on('create/person', (data: any) => createPerson(io, data));

        socket.on('update/person', (data: any) => updatePerson(io, data));

        socket.on('delete/person', (id: any) => deletePerson(io, id));

        io.on('connect_error', (err: any) => {
            console.log(`connect_error due to ${err.message}`);
        });
    });
};
