module.exports = {
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['js', 'json'],
    rootDir: '.',
    testMatch: [
        "**/__tests__/**/*.test.js",
        "**/?(*.)+(spec|test).js"
    ],
    transform: {
        '^.+\\.js$': 'babel-jest'
    },
    collectCoverageFrom: [
        "src/js/**/*.js",
        "!src/js/__tests__/**"
    ],
    moduleNameMapping: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    }
};