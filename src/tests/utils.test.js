const { MESSAGES } = require('../constants');

const {
  logMessage,
  logWarning,
  logErrorAndExit,
  deduplicateArray,
  concatenateArray,
  findDuplicatesInArrays,
} = require('../utils');

describe('utils.js', () => {

  describe('loggers', () => {

    global.console = {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };
    
    global.process.exit = jest.fn();

    const mockMessage = 'test message';

    beforeEach(() => {
      console.log.mockClear();
      console.warn.mockClear();
      console.error.mockClear();
      
      process.exit.mockClear();
    });

    it('logMessage logs standard message to console', () => {
      logMessage(mockMessage);

      expect(console.log).toBeCalledTimes(1);
      expect(console.log).toBeCalledWith(mockMessage);
    });

    it('logWarning logs warning message to console', () => {
      logWarning(mockMessage);

      expect(console.warn).toBeCalledTimes(1);
      expect(console.warn).toBeCalledWith(`WARNING: ${mockMessage}`);
    });

    it('logErrorAndExit logs standard "process finished with failure" message and error message to console and exits with status code 1', () => {
      logErrorAndExit(mockMessage);

      expect(console.log).toBeCalledTimes(1);
      expect(console.log).toBeCalledWith(MESSAGES.processingFinishedWithFailure());

      expect(console.error).toBeCalledTimes(1);
      expect(console.error).toBeCalledWith(`ERROR: ${mockMessage}`);

      expect(process.exit).toBeCalledTimes(1);
      expect(process.exit).toBeCalledWith(1);
    });

  });

  describe('array manipulators', () => {

    it('deduplicateArray returns empty array if provided with empty array', () => {
      expect(deduplicateArray([])).toEqual([]);
    });

    it('deduplicateArray returns identical array if no duplicates found', () => {
      const array = ['a', 'b', 'c'];

      expect(deduplicateArray(array)).toEqual(array);
    });

    it('deduplicateArray returns array with 1 duplicate removed', () => {
      const array = ['a', 'a', 'b', 'c'];
      const deduplicatedArray = ['a', 'b', 'c'];

      expect(deduplicateArray(array)).toEqual(deduplicatedArray);
    });

    it('deduplicateArray returns array with 2 identical duplicates removed', () => {
      const array = ['a', 'b', 'b', 'b', 'c'];
      const deduplicatedArray = ['a', 'b', 'c'];

      expect(deduplicateArray(array)).toEqual(deduplicatedArray);
    });

    it('deduplicateArray returns array with 2 different duplicates removed', () => {
      const array = ['a', 'b', 'b', 'c', 'c'];
      const deduplicatedArray = ['a', 'b', 'c'];

      expect(deduplicateArray(array)).toEqual(deduplicatedArray);
    });

    it('concatenateArray returns empty string when provided with empty array', () => {
      expect(concatenateArray([])).toEqual('');
    });

    it('concatenateArray returns string containing concatenated array elements', () => {
      const array = ['a', 'b', 'c'];
      const concatenatedArray = ',a,b,c';

      expect(concatenateArray(array)).toEqual(concatenatedArray);
    });

    it('concatenateArray returns string containing concatenated array elements with custom delimiter', () => {
      const array = ['a', 'b', 'c'];
      const delimiter = '-';
      const concatenatedArray = '-a-b-c';

      expect(concatenateArray(array, delimiter)).toEqual(concatenatedArray);
    });

    it('concatenateArray returns string containing concatenated array elements with custom delimiter and initial value', () => {
      const array = ['a', 'b', 'c'];
      const delimiter = '+';
      const initialValue = 'xyz';
      const concatenatedArray = 'xyz+a+b+c';

      expect(concatenateArray(array, delimiter, initialValue)).toEqual(concatenatedArray);
    });

    it('does not find duplicates when both arrays are empty', () => {
      expect(findDuplicatesInArrays([], [])).toEqual([]);
    });

    it('does not find duplicates when first array is empty', () => {
      expect(findDuplicatesInArrays(['a', 'b', 'c'], [])).toEqual([]);
    });

    it('does not find duplicates when second array is empty', () => {
      expect(findDuplicatesInArrays([], ['d', 'e', 'f'])).toEqual([]);
    });

    it('does not find duplicates when both arrays have unique values', () => {
      expect(findDuplicatesInArrays(['a', 'b', 'c'], ['d', 'e', 'f'])).toEqual([]);
    });

    it('does find duplicate if there is 1', () => {
      expect(findDuplicatesInArrays(['a', 'b', 'c'], ['a', 'e', 'f'])).toEqual(['a']);
    });

    it('does find duplicates when there are 2', () => {
      expect(findDuplicatesInArrays(['a', 'b', 'c'], ['d', 'b', 'c'])).toEqual(['b', 'c']);
    });

    it('does find all duplicates if arrays are identical', () => {
      expect(findDuplicatesInArrays(['a', 'b', 'c'], ['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
    });

  });

});