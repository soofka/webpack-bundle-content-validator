const DEFAULTS = {
  mandatoryDependencies: [],
  disallowedDependencies: [],
  failOnInvalid: false,
};

const DEFAULTS_CLI = {
  statsFilePath: 'stats.json',
};

const MESSAGES = {
  processingFinished: (success) => `Webpack Bundle Content Validator finished; result: ${success ? 'SUCCESS' : 'FAILURE'}`,
  unrecognizedArg: (arg) => `Unrecognized argument: ${arg}`,
  statsDoesNotExist: (stats) => `File does not exist: ${stats}`,
  statsIsNotValidJson: (stats) => `${stats} file is not valid JSON`,
  statsIsNotValidWebpackCompilationObject: (stats) => `${stats} file is not valid Webpack compilation object`,
  dependenciesShouldBeAnArray: (name, type) => `${name} dependencies should be an array, but are ${type}`,
  dependencyCannotBeMandatoryAndDisallowed: (dependencies) => `The same dependencies can not be mandatory and disallowed at the same time: ${dependencies.map(dependency => decodeURI(dependency))}`,
  mandatoryDependenciesNotIncluded: (dependencies) => `Mandatory dependencies not included: ${dependencies.map(dependency => decodeURI(dependency))}`,
  disallowedDependenciesIncluded: (dependencies) => `Disallowed dependencies included: ${dependencies.map(dependency => decodeURI(dependency))}`,
};

module.exports = {
  DEFAULTS,
  DEFAULTS_CLI,
  MESSAGES,
}