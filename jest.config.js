/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  resolver: 'jest-preset-angular/build/resolvers/ng-jest-resolver',
  testMatch: [
    '<rootDir>/src/lib/accessibility-center.a11y.spec.ts',
    '<rootDir>/src/lib/panel_strip.integration.spec.ts'
  ],
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$|@angular|rxjs)'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['ts', 'js', 'mjs', 'json', 'node'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  collectCoverageFrom: [
    'src/lib/**/*.ts',
    '!src/lib/**/*.spec.ts',
    '!src/lib/**/index.ts',
  ],
};