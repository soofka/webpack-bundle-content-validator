const fs = require('fs');
jest.mock('fs');

const validate = require('../validator');
jest.mock('../validator');

const {
  logErrorAndExit,
  deduplicateArray,
  findDuplicatesInArrays,
  normalizeString,
} = require('../utils');
jest.mock('../utils');

const path = require('path');

const {
  MESSAGES,
  DEFAULTS,
  DEFAULTS_CLI,
} = require('../constants');

const main = require('../cli');

describe('cli.js', () => {

  const mockPathToStats = 'test/path/to/stats.json';
  const mockFullPathToStats = path.resolve(__dirname, '../', mockPathToStats);

  fs.existsSync.mockImplementation(filePath => filePath === mockFullPathToStats);
  logErrorAndExit.mockImplementation((message) => {
    throw message;
  });
  deduplicateArray.mockImplementation(array => array);
  findDuplicatesInArrays.mockImplementation(() => []);
  normalizeString.mockImplementation(string => string);

  it('logs error and exits when there is unrecognized arg', () => {
    const mockArg = '--test';
    global.process.argv = [0, 1, mockArg];

    expect(() => main()).toThrow(MESSAGES.unrecognizedArg(mockArg));
  });

  it('logs error and exits when stats file does not exist', () => {
    global.process.argv = [0, 1, `-s=${mockPathToStats}`];
    fs.existsSync.mockImplementationOnce(filePath => !(filePath === mockFullPathToStats));

    expect(() => main()).toThrow(MESSAGES.statsDoesNotExist(mockFullPathToStats));
  });

  it('logs error and exits when stats file is not valid JSON', () => {
    global.process.argv = [0, 1, `-s=${mockPathToStats}`];
    global.JSON.parse = jest.fn(() => {
      throw 'Invalid JSON';
    });

    expect(() => main()).toThrow(MESSAGES.statsIsNotValidJson(mockFullPathToStats));
  });

  it('logs error and exits when stats file is not valid Webpack compilation object', () => {
    global.process.argv = [0, 1, `-s=${mockPathToStats}`];
    global.JSON.parse = jest.fn(() => ({}));

    expect(() => main()).toThrow(MESSAGES.statsIsNotValidWebpackCompilationObject(mockFullPathToStats));
  });

  it('logs error and exits when dependency is mandatory and disallowed at the same time', () => {
    const mockDependency = 'testDependency';

    global.process.argv = [0, 1, `-s=${mockPathToStats}`, `-d=${mockDependency}`, `-m=${mockDependency}`];
    global.JSON.parse = jest.fn(() => ({ modules: [] }));
    findDuplicatesInArrays.mockImplementationOnce(() => [mockDependency]);

    expect(() => main()).toThrow(MESSAGES.dependencyCannotBeMandatoryAndDisallowed([mockDependency]));
  });

  describe('invokes validator', () => {

    const mockModuleName = 'testModule';
    const mockMandatoryDependencies = ['testDependency1', 'testDependency2'];
    const mockDisallowedDependencies = ['testDependency3', 'testDependency4'];

    beforeEach(() => {
      global.JSON.parse = jest.fn(() => ({ modules: [ { name: mockModuleName } ] }));
      deduplicateArray.mockClear();
      validate.mockClear();
    });

    it('after deduplicating mandatory and disallowed dependencies', () => {
      global.process.argv = [
        0,
        1,
        `-s=${mockPathToStats}`,
        `-m=${mockMandatoryDependencies.join(',')}`,
        `-d=${mockDisallowedDependencies.join(',')}`,
      ];

      main();

      expect(deduplicateArray).toBeCalledTimes(2);
      expect(deduplicateArray.mock.calls).toEqual(
        [[mockMandatoryDependencies], [mockDisallowedDependencies]]
      );
    });

    it('with proper default parameters', () => {
      global.process.argv = [0, 1];
      fs.existsSync.mockImplementationOnce(filePath => 
        filePath === path.resolve(__dirname, '../', DEFAULTS_CLI.statsFilePath)
      );
  
      main();
  
      expect(validate).toBeCalledTimes(1);
      expect(validate).toBeCalledWith(
        [mockModuleName],
        DEFAULTS.mandatoryDependencies,
        DEFAULTS.disallowedDependencies,
        DEFAULTS.failOnInvalid,
      );
    });

    it('with proper custom parameters provided by short names', () => {
      global.process.argv = [
        0,
        1,
        `-s=${mockPathToStats}`,
        `-m=${mockMandatoryDependencies.join(',')}`,
        `-d=${mockDisallowedDependencies.join(',')}`,
        `-f`,
      ];

      main();
  
      expect(validate).toBeCalledTimes(1);
      expect(validate).toBeCalledWith(
        [mockModuleName],
        mockMandatoryDependencies,
        mockDisallowedDependencies,
        true,
      );
    });

    it('with proper custom parameters provided by full names', () => {
      global.process.argv = [
        0,
        1,
        `--stats=${mockPathToStats}`,
        `--mandatory=${mockMandatoryDependencies.join(',')}`,
        `--disallowed=${mockDisallowedDependencies.join(',')}`,
        `--fail`,
      ];

      main();
  
      expect(validate).toBeCalledTimes(1);
      expect(validate).toBeCalledWith(
        [mockModuleName],
        mockMandatoryDependencies,
        mockDisallowedDependencies,
        true,
      );
    });

  });

});