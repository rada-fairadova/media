module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    transform: {
      '^.+\\.js$': 'babel-jest',
    },
    moduleNameMapping: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    },
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js']
  };