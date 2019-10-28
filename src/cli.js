const {
  DEFAULTS,
  DEFAULTS_CLI,
  MESSAGES,
} = require('./constants');

const {
  logMessage,
  logErrorAndExit,
  deduplicateArray,
  findDuplicatesInArrays,
  normalizeString,
} = require('./utils');

const validate = require('./validator');

const fs = require('fs');
const path = require('path');

const main = () => {
  const args = process.argv.splice(2);

  logMessage(MESSAGES.cliStarted(args));

  const parsedArgs = parseArgs(
    args,
    {
      ...DEFAULTS,
      ...DEFAULTS_CLI,
    },
  );

  const stats = validateStats(parsedArgs.statsFilePath);
  const dependenciesPaths = parseStats(stats);

  validateDependencies(
    parsedArgs.mandatoryDependencies,
    parsedArgs.disallowedDependencies,
  )

  validate(
    dependenciesPaths,
    parsedArgs.mandatoryDependencies,
    parsedArgs.disallowedDependencies,
    parsedArgs.failOnInvalid,
  );
}

const parseArgs = (args, defaultArgs) => {
  const parsedArgs = { ...defaultArgs };

  args.forEach(arg => {
    const [key, value] = arg.split('=');

    switch (key) {
      case '-s':
      case '--stats':
        parsedArgs.statsFilePath = path.resolve(__dirname, value);
        break;

      case '-m':
      case '--mandatory':
        parsedArgs.mandatoryDependencies =
          deduplicateArray(
            value.split(',').map(element => normalizeString(element))
          );
        break;

      case '-d':
      case '--disallowed':
        parsedArgs.disallowedDependencies = 
          deduplicateArray(
            value.split(',').map(element => normalizeString(element))
          );
        break;

      case '-f':
      case '--fail':
        parsedArgs.failOnInvalid = true;
        break;

      default:
        logErrorAndExit(MESSAGES.unrecognizedArg(arg));
        break;
    }
  });

  return parsedArgs;
};

const validateStats = (stats) => {
  if (!fs.existsSync(stats)) {
    logErrorAndExit(MESSAGES.statsDoesNotExist(stats));
  }

  const statsRaw = fs.readFileSync(stats);
  let statsJson;

  try {
    statsJson = JSON.parse(statsRaw);
  } catch (error) {
    logErrorAndExit(MESSAGES.statsIsNotValidJson(stats));
  }

  if (!statsJson.modules) {
    logErrorAndExit(MESSAGES.statsIsNotValidWebpackCompilationObject(stats));
  }

  return statsJson;
};

const parseStats = (stats) =>
  stats.modules
    ? stats.modules
      .filter(module => module.name)
      .map(module => normalizeString(module.name))
    : [];

const validateDependencies = (mandatoryDependencies, disallowedDependencies) => {
  const duplicatedDependencies = findDuplicatesInArrays(
    mandatoryDependencies,
    disallowedDependencies,
  );

  if (duplicatedDependencies.length > 0) {
    logErrorAndExit(MESSAGES.dependencyCannotBeMandatoryAndDisallowed(duplicatedDependencies));
  }
}

main();
