module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': 'babel-jest',
    },
    transformIgnorePatterns: [
        "node_models/(?!sequelize-typescript)",]
};
