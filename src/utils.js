const { MESSAGES } = require('./constants');

const logMessage = (message) => console.log(message);

const logWarning = (warning) => console.warn(`WARNING: ${warning}`);

const logErrorAndExit = (error) => {
  console.error(`ERROR: ${error}`);
  logMessage(MESSAGES.processingFinished(false));
  process.exit(1);
};

const deduplicateArray = (array) =>
  array.filter((item, index) => array.indexOf(item) === index);

const findDuplicatesInArrays = (array1, array2) => {
  const duplicates = [];

  array1.forEach(element => {
    if (array2.indexOf(element) !== -1) {
      duplicates.push(element);
    }
  });

  return duplicates;
};

const normalizeString = (string) =>
  typeof string === 'string' ? encodeURI(string.replace(/\//g, '\\')) : '';

module.exports = {
  logMessage,
  logWarning,
  logErrorAndExit,
  deduplicateArray,
  findDuplicatesInArrays,
  normalizeString,
};
