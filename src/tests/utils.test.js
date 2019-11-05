const { MESSAGES } = require('../constants');

const {
  logMessage,
  logWarning,
  logErrorAndExit,
  deduplicateArray,
  findDuplicatesInArrays,
  normalizeString,
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

      expect(console.error).toBeCalledTimes(1);
      expect(console.error).toBeCalledWith(`ERROR: ${mockMessage}`);

      expect(console.log).toBeCalledTimes(1);
      expect(console.log).toBeCalledWith(MESSAGES.processingFinished(false));

      expect(process.exit).toBeCalledTimes(1);
      expect(process.exit).toBeCalledWith(1);
    });

  });

  describe('array manipulators', () => {

    describe('deduplicateArray', () => {

      it('returns empty array if provided with empty array', () => {
        expect(deduplicateArray([])).toEqual([]);
      });

      it('returns identical array if no duplicates found', () => {
        const array = ['a', 'b', 'c'];

        expect(deduplicateArray(array)).toEqual(array);
      });

      it('returns array with 1 duplicate removed', () => {
        const array = ['a', 'a', 'b', 'c'];
        const deduplicatedArray = ['a', 'b', 'c'];

        expect(deduplicateArray(array)).toEqual(deduplicatedArray);
      });

      it('returns array with 2 identical duplicates removed', () => {
        const array = ['a', 'b', 'b', 'b', 'c'];
        const deduplicatedArray = ['a', 'b', 'c'];

        expect(deduplicateArray(array)).toEqual(deduplicatedArray);
      });

      it('returns array with 2 different duplicates removed', () => {
        const array = ['a', 'b', 'b', 'c', 'c'];
        const deduplicatedArray = ['a', 'b', 'c'];

        expect(deduplicateArray(array)).toEqual(deduplicatedArray);
      });

    });

    describe('findDuplicatesInArrays', () => {

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

  describe('string manipulators', () => {

    describe('normalizeString', () => {

      it('returns empty string if no parameter is provided', () => {
        expect(normalizeString()).toEqual('');
      });

      it('returns empty string if parameter is not of type string', () => {
        expect(normalizeString(0)).toEqual('');
      });

      it('returns the same string if parameter does not contain slashes', () => {
        expect(normalizeString('test')).toEqual('test');
      });

      it('replaces one slash with backslash', () => {
        expect(normalizeString('t/est')).toEqual(encodeURI('t\\est'));
      });

      it('replaces multiple slashes with backslashes', () => {
        expect(normalizeString('t/es/t')).toEqual(encodeURI('t\\es\\t'));
      });

    });

  });

});