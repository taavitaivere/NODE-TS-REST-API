module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': 'babel-jest',
    },
    transformIgnorePatterns: [
        "node_models/(?!sequelize-typescript)",],
    reporters: ['default', ['./node_modules/@testomatio/reporter/lib/adapter/jest.js', { apiKey: process.env.TESTOMATIO }]]
};
