const validate = require('../validator');
jest.mock('../validator');

const {
  logErrorAndExit,
  deduplicateArray,
  findDuplicatesInArrays,
  normalizeString,
} = require('../utils');
jest.mock('../utils');

const {
  MESSAGES,
  DEFAULTS,
} = require('../constants');

const WebpackBundleContentValidatorPlugin = require('../plugin');

describe('plugin.js', () => {

  const mockModuleName = 'testModule';
  const mockStats = { compilation: { modules: [ { resource: mockModuleName } ] } };

  logErrorAndExit.mockImplementation((message) => {
    throw message;
  });
  deduplicateArray.mockImplementation(array => array);
  findDuplicatesInArrays.mockImplementation(() => []);
  normalizeString.mockImplementation(string => string);

  it('accepts options properly', () => {
    const mockOptions = 'testOptions';
    const plugin = new WebpackBundleContentValidatorPlugin(mockOptions);

    expect(plugin.options).toEqual(mockOptions);
  });

  it('taps on "done" hook', () => {
    const mockCompiler = { hooks: { done: { tap: jest.fn() } } };
    const plugin = new WebpackBundleContentValidatorPlugin();
    
    plugin.apply(mockCompiler);

    expect(mockCompiler.hooks.done.tap).toBeCalledTimes(1);
    expect(mockCompiler.hooks.done.tap).toBeCalledWith(
      'Webpack Bundle Content Validator Plugin',
      expect.any(Function),
    );
  });

  it('logs error and exits when mandatory dependencies are not an array', () => {
    const plugin = new WebpackBundleContentValidatorPlugin({
      mandatoryDependencies: true,
    });

    expect(() => plugin.process(mockStats)).toThrow(MESSAGES.dependenciesShouldBeAnArray('Mandatory', typeof true));
  });

  it('logs error and exits when disallowed dependencies are not an array', () => {
    const plugin = new WebpackBundleContentValidatorPlugin({
      disallowedDependencies: true,
    });

    expect(() => plugin.process(mockStats)).toThrow(MESSAGES.dependenciesShouldBeAnArray('Disallowed', typeof true));
  });

  it('logs error and exits when dependency is mandatory and disallowed at the same time', () => {
    const mockDependency = 'testDependency';
    findDuplicatesInArrays.mockImplementationOnce(() => [mockDependency]);

    const plugin = new WebpackBundleContentValidatorPlugin({
      mandatoryDependencies: [mockDependency],
      disallowedDependencies: [mockDependency],
    });

    expect(() => plugin.process(mockStats)).toThrow(MESSAGES.dependencyCannotBeMandatoryAndDisallowed([mockDependency]));
  });

  describe('invokes validator', () => {

    const mockMandatoryDependencies = ['testDependency1', 'testDependency2'];
    const mockDisallowedDependencies = ['testDependency3', 'testDependency4'];

    beforeEach(() => {
      deduplicateArray.mockClear();
      validate.mockClear();
    });

    it('after deduplicating mandatory and disallowed dependencies', () => {
      const plugin = new WebpackBundleContentValidatorPlugin({
        mandatoryDependencies: mockMandatoryDependencies,
        disallowedDependencies: mockDisallowedDependencies,
      });
      plugin.process(mockStats);

      expect(deduplicateArray).toBeCalledTimes(2);
      expect(deduplicateArray.mock.calls).toEqual(
        [[mockMandatoryDependencies], [mockDisallowedDependencies]]
      );
    });

    it('with proper default parameters', () => {
      const plugin = new WebpackBundleContentValidatorPlugin();
      plugin.process(mockStats);

      expect(validate).toBeCalledTimes(1);
      expect(validate).toBeCalledWith(
        [mockModuleName],
        DEFAULTS.mandatoryDependencies,
        DEFAULTS.disallowedDependencies,
        DEFAULTS.failOnInvalid,
      );
    });

    it('with proper custom parameters', () => {
      const plugin = new WebpackBundleContentValidatorPlugin({
        mandatoryDependencies: mockMandatoryDependencies,
        disallowedDependencies: mockDisallowedDependencies,
        failOnInvalid: true,
      });
      plugin.process(mockStats);

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