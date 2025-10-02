module.exports = {
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.js$': 'babel-jest',
    },
    moduleNameMapping: {
      '\\.(css|less)$': 'identity-obj-proxy'
    }
  };