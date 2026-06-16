export default {
  testEnvironment: 'node',
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },
  restoreMocks: true,
  coveragePathIgnorePatterns: [
    'node_modules',
    'src/config',
    'src/app.js',
    'tests'
  ],
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  setupFilesAfterEnv: ['<rootDir>/mocks.js'],
  transform: {
    '^.+\\.(js|ts|mjs)$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'ts', 'mjs', 'json', 'node'],
  transformIgnorePatterns: [
    '/node_modules/(?!(@faker-js|@prisma)/)'
  ],
};