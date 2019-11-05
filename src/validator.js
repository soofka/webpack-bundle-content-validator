const { MESSAGES } = require('./constants');

const {
  logMessage,
  logWarning,
  logErrorAndExit,
} = require('./utils');

const validate = (
  dependenciesPaths,
  mandatoryDependencies,
  disallowedDependencies,
  failOnInvalid,
) => {
  const {
    mandatoryDependenciesNotIncluded,
    disallowedDependenciesIncluded,
  } = parseDependencies(
    dependenciesPaths,
    mandatoryDependencies,
    disallowedDependencies,
  );

  const {
    valid,
    errorMessage,
  } = validateBundleContent(
    mandatoryDependenciesNotIncluded,
    disallowedDependenciesIncluded,
  );

  if (valid) {
    logMessage(MESSAGES.processingFinished(true));
  } else {
    if (failOnInvalid) {
      logErrorAndExit(errorMessage);
    } else {
      logWarning(errorMessage);
      logMessage(MESSAGES.processingFinished(false));
    }
  }
};

const parseDependencies = (dependenciesPaths, mandatoryDependencies, disallowedDependencies) => {
  const dependencyRegexpBaseStart = '%5Cnode_modules%5C';
  const dependencyRegexpBaseEnd = '($|%5C)';

  const mandatoryDependenciesNotIncluded = [...mandatoryDependencies];
  const disallowedDependenciesIncluded = [];

  dependenciesPaths.forEach(dependencyPath => {
    mandatoryDependenciesNotIncluded.forEach((dependency, index) => {
      const dependencyRegexp = new RegExp(
        `${dependencyRegexpBaseStart}${dependency}${dependencyRegexpBaseEnd}`
      );
      
      if (dependencyRegexp.test(dependencyPath)) {
        mandatoryDependenciesNotIncluded.splice(index, 1);
      }
    });

    disallowedDependencies.forEach(dependency => {
      if (disallowedDependenciesIncluded.indexOf(dependency) === -1) {
        const dependencyRegexp = new RegExp(
          `${dependencyRegexpBaseStart}${dependency}${dependencyRegexpBaseEnd}`
        );

        if (dependencyRegexp.test(dependencyPath)) {
          disallowedDependenciesIncluded.push(dependency);
        }
      }
    });
  });

  return {
    mandatoryDependenciesNotIncluded,
    disallowedDependenciesIncluded,
  };
};

const validateBundleContent = (mandatoryDependenciesNotIncluded, disallowedDependenciesIncluded) => {
  let valid = true;
  let errorMessages = [];

  if (mandatoryDependenciesNotIncluded.length > 0) {
    valid = false;
    errorMessages.push(MESSAGES.mandatoryDependenciesNotIncluded(mandatoryDependenciesNotIncluded));
  }

  if (disallowedDependenciesIncluded.length > 0) {
    valid = false;
    errorMessages.push(MESSAGES.disallowedDependenciesIncluded(disallowedDependenciesIncluded));
  }

  return {
    valid,
    errorMessage: errorMessages.join('\r\n'),
  };
};

module.exports = validate;
