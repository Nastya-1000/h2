import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const extensionsOfArgs = [['.json', '.json'], ['.yaml', '.yml'], ['.ini', '.ini']];
const dirpath = '__tests__/__fixtures__/';

const makeFilepath = (pathToDir, name, extension) => path.join(pathToDir, `${name}${extension}`);

const argumentsForTest = extensionsOfArgs.map((extension) => {
  const pathToFile1 = makeFilepath(dirpath, 'before', extension[0]);
  const pathToFile2 = makeFilepath(dirpath, 'after', extension[1]);
  const pathToResult = makeFilepath(dirpath, 'result', '.txt');
  return [pathToFile1, pathToFile2, pathToResult];
});

test.each(argumentsForTest)(
  'should work for all',
  (a, b, c) => {
    const actual = genDiff(a, b);
    const expected = fs.readFileSync(c, 'utf-8');
    expect(actual).toBe(expected);
  },
);

test('should fail for different formats', () => {
  const pathToFile1 = makeFilepath(dirpath, 'before', '.yaml');
  const pathToFile2 = makeFilepath(dirpath, 'after', '.json');
  const actual = genDiff(pathToFile1, pathToFile2);
  const expected = 'Files have different formats';
  expect(actual).toBe(expected);
});
