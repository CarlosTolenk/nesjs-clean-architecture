module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '\\.spec\\.ts$',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  transform: {
    "^.+\\.(t|j)s?$": ["@swc/jest"]
  },
  collectCoverage: true,
  collectCoverageFrom: ['**/*.{ts,js}', '!**/*.d.ts'],
  coveragePathIgnorePatterns: [
    'node_modules',
    'interfaces',
    'index.ts',
    'default.ts',
    'main.ts',
    'modules/metrics/*',
    'modules/shared/infrastructure/persistence/migrations/*',
    'initial-values.ts',
    'export-server.ts',
    '.module.ts',
    '.mock.ts',
    '.spec.ts',
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  transformIgnorePatterns: ['!node_modules/'],
  moduleNameMapper: {},
};
