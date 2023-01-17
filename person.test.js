const sum = require('./src/app.ts');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

afterAll(async done => {
  // Closing the DB connection allows Jest to exit successfully.
  dbConnection.close();
  done();
});
