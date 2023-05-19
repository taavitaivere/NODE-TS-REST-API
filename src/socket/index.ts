const { getAllPersons } = require('../controller/socketController');

module.exports = (io: { on: (arg0: string, arg1: (arg0: any) => void) => void; }) => {

    io.on('connection', (socket: { on: (arg0: string, arg1: (arg0: any) => void) => void; }) => {
        socket.on('get/persons', () => getAllPersons(io));

        io.on('connect_error', (err: any) => {
            console.log(`connect_error due to ${err.message}`);
        });
    });
};
