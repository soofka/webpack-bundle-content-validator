const { MESSAGES } = require('./constants');

const logMessage = (message) => console.log(message);

const logWarning = (warning) => console.warn(`WARNING: ${warning}`);

const logErrorAndExit = (error) => {
  logMessage(MESSAGES.processingFinishedWithFailure());
  console.error(`ERROR: ${error}`);
  process.exit(1);
};

const deduplicateArray = (array) => array.filter((item, index) => array.indexOf(item) === index);

const concatenateArray = (array, delimiter = ',', initValue = '') => array.reduce((a, b) => `${a}${delimiter}${b}`, initValue);

const findDuplicatesInArrays = (array1, array2) => {
  const duplicates = [];

  array1.forEach(element => {
    if (array2.indexOf(element) !== -1) {
      duplicates.push(element);
    }
  });

  return duplicates;
};

const normalizeString = (string) => typeof string === 'string' ? encodeURI(string.replace(/\//g, '\\')) : '';

module.exports = {
  logMessage,
  logWarning,
  logErrorAndExit,
  deduplicateArray,
  concatenateArray,
  findDuplicatesInArrays,
  normalizeString,
};
