import fs from 'fs';
import genDiff from '../src';

test('should work', () => {
  const pathToFile1 = '__tests__/__fixtures__/before.json';
  const pathToFile2 = '__tests__/__fixtures__/after.json';
  const pathToResult = '__tests__/__fixtures__/result.txt';
  const actual = genDiff(pathToFile1, pathToFile2);
  const expected = fs.readFileSync(pathToResult, 'utf-8').replace(/\n$/m, '');
  expect(actual).toBe(expected);
});
