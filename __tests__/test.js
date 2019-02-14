import fs from 'fs';
import genDiff from '../src';

test('should work for json', () => {
  const pathToFile1 = '__tests__/__fixtures__/before.json';
  const pathToFile2 = '__tests__/__fixtures__/after.json';
  const pathToResult = '__tests__/__fixtures__/result.txt';
  const actual = genDiff(pathToFile1, pathToFile2);
  const expected = fs.readFileSync(pathToResult, 'utf-8');
  expect(actual).toBe(expected);
});

test('should work for yaml', () => {
  const pathToFile1 = '__tests__/__fixtures__/before.yml';
  const pathToFile2 = '__tests__/__fixtures__/after.yml';
  const pathToResult = '__tests__/__fixtures__/result.txt';
  const actual = genDiff(pathToFile1, pathToFile2);
  const expected = fs.readFileSync(pathToResult, 'utf-8');
  expect(actual).toBe(expected);
});
