const {
  logMessage,
  logWarning,
  logErrorAndExit,
} = require('../utils');
jest.mock('../utils');

const { MESSAGES } = require('../constants');

const validate = require('../validator');

describe('validator.js', () => {

  const mockMandatoryDependency = 'testMandatoryDependency';
  const mockDisallowedDependency = 'testDisallowedDependency';

  const expectSuccess = () => {
    expect(logMessage).toBeCalledTimes(1);
    expect(logMessage).toBeCalledWith(MESSAGES.processingFinished(true));

    expect(logWarning).toBeCalledTimes(0);

    expect(logErrorAndExit).toBeCalledTimes(0);
  };

  const expectFailure = (error, failOnInvalid) => {
    if (failOnInvalid) {
      expect(logMessage).toBeCalledTimes(0);

      expect(logWarning).toBeCalledTimes(0);

      expect(logErrorAndExit).toBeCalledTimes(1);
      expect(logErrorAndExit).toBeCalledWith(error);
    } else {
      expect(logMessage).toBeCalledTimes(1);
      expect(logMessage).toBeCalledWith(MESSAGES.processingFinished(false));

      expect(logWarning).toBeCalledTimes(1);
      expect(logWarning).toBeCalledWith(error);

      expect(logErrorAndExit).toBeCalledTimes(0);
    }
  };

  beforeEach(() => {
    logMessage.mockClear();
    logWarning.mockClear();
    logErrorAndExit.mockClear();
  });

  describe('if there are mandatory dependencies defined', () => {
    
    it('and they are not bundled and failOnInvalid is set to false', () => {
      validate(
        [],
        [mockMandatoryDependency],
        [],
        false,
      );

      expectFailure(MESSAGES.mandatoryDependenciesNotIncluded([mockMandatoryDependency]), false);
    });

    it('and they are not bundled and failOnInvalid is set to true', () => {
      validate(
        [],
        [mockMandatoryDependency],
        [],
        true,
      );

      expectFailure(MESSAGES.mandatoryDependenciesNotIncluded([mockMandatoryDependency]), true);
    });

    it('and they are bundled from node_modules and failOnInvalid is set to false', () => {
      validate(
        [`%5Cnode_modules%5C${mockMandatoryDependency}`],
        [mockMandatoryDependency],
        [],
        false,
      );

      expectSuccess();
    });

    it('and they are bundled from node_modules and failOnInvalid is set to true', () => {
      validate(
        [`%5Cnode_modules%5C${mockMandatoryDependency}`],
        [mockMandatoryDependency],
        [],
        true,
      );

      expectSuccess();
    });

    it('and they are bundled from outside of node_modules and failOnInvalid is set to false', () => {
      validate(
        [`%5Cnot_node_modules%5C${mockMandatoryDependency}`],
        [mockMandatoryDependency],
        [],
        false,
      );

      expectFailure(MESSAGES.mandatoryDependenciesNotIncluded([mockMandatoryDependency]), false);
    });

    it('and they are bundled from outside of node_modules and failOnInvalid is set to true', () => {
      validate(
        [`%5Cnot_node_modules%5C${mockMandatoryDependency}`],
        [mockMandatoryDependency],
        [],
        true,
      );

      expectFailure(MESSAGES.mandatoryDependenciesNotIncluded([mockMandatoryDependency]), true);
    });

    it('and their parts are bundled from node_modules and failOnInvalid is set to false', () => {
      validate(
        [`%5Cnode_modules%5C${mockMandatoryDependency}%5CsubModule.js`],
        [mockMandatoryDependency],
        [],
        false,
      );

      expectSuccess();
    });

    it('and their parts are bundled from node_modules and failOnInvalid is set to true', () => {
      validate(
        [`%5Cnode_modules%5C${mockMandatoryDependency}%5CsubModule.js`],
        [mockMandatoryDependency],
        [],
        true,
      );

      expectSuccess();
    });

    it('and their parts are bundled from outside of node_modules and failOnInvalid is set to false', () => {
      validate(
        [`%5Cnot_node_modules%5C${mockMandatoryDependency}%5CsubModule.js`],
        [mockMandatoryDependency],
        [],
        false,
      );

      expectFailure(MESSAGES.mandatoryDependenciesNotIncluded([mockMandatoryDependency]), false);
    });

    it('and their parts are bundled from outside of node_modules and failOnInvalid is set to true', () => {
      validate(
        [`%5Cnot_node_modules%5C${mockMandatoryDependency}%5CsubModule.js`],
        [mockMandatoryDependency],
        [],
        true,
      );

      expectFailure(MESSAGES.mandatoryDependenciesNotIncluded([mockMandatoryDependency]), true);
    });

  });

  describe('if there are disallowed dependencies defined', () => {

    it('and they are not bundled and failOnInvalid is set to false', () => {
      validate(
        [],
        [],
        [mockDisallowedDependency],
        false,
      );

      expectSuccess();
    });

    it('and they are not bundled and failOnInvalid is set to true', () => {
      validate(
        [],
        [],
        [mockDisallowedDependency],
        true,
      );

      expectSuccess();
    });

    it('and they are bundled from node_modules and failOnInvalid is set to false', () => {
      validate(
        [`%5Cnode_modules%5C${mockDisallowedDependency}`],
        [],
        [mockDisallowedDependency],
        false,
      );

      expectFailure(MESSAGES.disallowedDependenciesIncluded([mockDisallowedDependency]), false);
    });

    it('and they are bundled from node_modules and failOnInvalid is set to true', () => {
      validate(
        [`%5Cnode_modules%5C${mockDisallowedDependency}`],
        [],
        [mockDisallowedDependency],
        true,
      );

      expectFailure(MESSAGES.disallowedDependenciesIncluded([mockDisallowedDependency]), true);
    });

    it('and they are bundled from outside of node_modules and failOnInvalid is set to false', () => {
      validate(
        [`%5Cnot_node_modules%5C${mockDisallowedDependency}`],
        [],
        [mockDisallowedDependency],
        false,
      );

      expectSuccess();
    });

    it('and they are bundled from outside of node_modules and failOnInvalid is set to true', () => {
      validate(
        [`%5Cnot_node_modules%5C${mockDisallowedDependency}`],
        [],
        [mockDisallowedDependency],
        true,
      );

      expectSuccess();
    });

    it('and their parts are bundled from node_modules and failOnInvalid is set to false', () => {
      validate(
        [`%5Cnode_modules%5C${mockDisallowedDependency}%5CsubModule.js`],
        [],
        [mockDisallowedDependency],
        false,
      );

      expectFailure(MESSAGES.disallowedDependenciesIncluded([mockDisallowedDependency]), false);
    });

    it('and their parts are bundled from node_modules and failOnInvalid is set to true', () => {
      validate(
        [`%5Cnode_modules%5C${mockDisallowedDependency}%5CsubModule.js`],
        [],
        [mockDisallowedDependency],
        true,
      );

      expectFailure(MESSAGES.disallowedDependenciesIncluded([mockDisallowedDependency]), true);
    });

    it('and their parts are bundled from outside of node_modules and failOnInvalid is set to false', () => {
      validate(
        [`%5Cnot_node_modules%5C${mockDisallowedDependency}%5CsubModule.js`],
        [],
        [mockDisallowedDependency],
        false,
      );

      expectSuccess();
    });

    it('and their parts are bundled from outside of node_modules and failOnInvalid is set to true', () => {
      validate(
        [`%5Cnot_node_modules%5C${mockDisallowedDependency}%5CsubModule.js`],
        [],
        [mockDisallowedDependency],
        true,
      );

      expectSuccess();
    });
  })

});