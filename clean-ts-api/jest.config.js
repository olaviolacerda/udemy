module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    '!**/protocols/**',
    '!<rootDir>/src/**/*-protocols.ts',
    '!**/test/**',
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  // Captura string que tenha a key e faz um replace pelo value $1 = resultado da captura
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  }
}
