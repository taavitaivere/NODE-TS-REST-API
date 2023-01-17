const sum = require('./src/app.ts');
import connection from "./src/db/config";
const { Person } = connection.models;

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

describe(' ', () => {
  beforeEach(async () => {
    await Person.create({});
  });
});
afterAll(async done => {
  // Closing the DB connection allows Jest to exit successfully.
  connection.close();
  done();
});
