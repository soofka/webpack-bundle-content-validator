const {
  DEFAULTS,
  MESSAGES,
} = require('./constants');

const {
  logErrorAndExit,
  deduplicateArray,
  findDuplicatesInArrays,
  normalizeString,
} = require('./utils');

const validate = require('./validator');

class WebpackBundleContentValidatorPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.done.tap(
      'Webpack Bundle Content Validator Plugin',
      (stats) => this.process(stats),
    );
  }

  process(stats) {
    const dependenciesPaths = parseStats(stats);
    const {
      mandatoryDependencies,
      disallowedDependencies,
      failOnInvalid,
    } = validateOptions({
      ...DEFAULTS,
      ...this.options,
    });

    validate(
      dependenciesPaths,
      mandatoryDependencies,
      disallowedDependencies,
      failOnInvalid,
    );
  }
}

const parseStats = (stats) =>
  stats.compilation && stats.compilation.modules
    ? stats.compilation.modules
      .filter(module => module.resource)
      .map(module => normalizeString(module.resource))
    : [];

const validateOptions = (options) => {
  if (!Array.isArray(options.mandatoryDependencies)) {
    logErrorAndExit(MESSAGES.dependenciesShouldBeAnArray('Mandatory', typeof options.mandatoryDependencies));
  }

  if (!Array.isArray(options.disallowedDependencies)) {
    logErrorAndExit(MESSAGES.dependenciesShouldBeAnArray('Disallowed', typeof options.disallowedDependencies));
  }
  
  const mandatoryDependencies = deduplicateArray(
    options.mandatoryDependencies.map(element => normalizeString(element))
  );
  const disallowedDependencies = deduplicateArray(
    options.disallowedDependencies.map(element => normalizeString(element))
  );

  const duplicatedDependencies = findDuplicatesInArrays(
    mandatoryDependencies,
    disallowedDependencies,
  );

  if (duplicatedDependencies.length > 0) {
    logErrorAndExit(MESSAGES.dependencyCannotBeMandatoryAndDisallowed(duplicatedDependencies));
  }

  return {
    mandatoryDependencies,
    disallowedDependencies,
    failOnInvalid: !!options.failOnInvalid,
  };
};

module.exports = WebpackBundleContentValidatorPlugin;
