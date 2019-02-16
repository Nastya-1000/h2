import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const extensionsOfArgs = [['.json', '.json'], ['.yaml', '.yml'], ['.ini', '.ini']];
const dirpath = '__tests__/__fixtures__';
const dirnames = ['plain', 'nested'];

const makeFilepath = (pathToDir, dirname, name, extension) => path.join(pathToDir, dirname, `${name}${extension}`);

const getArgs = dirname => extensionsOfArgs.map((extension) => {
  const pathToFile1 = makeFilepath(dirpath, dirname, 'before', extension[0]);
  const pathToFile2 = makeFilepath(dirpath, dirname, 'after', extension[1]);
  const pathToResult = makeFilepath(dirpath, dirname, 'result', '.txt');
  return [pathToFile1, pathToFile2, pathToResult];
});

const argumentsForTest = dirnames.reduce((acc, name) => [...acc, ...getArgs(name)], []);

test.each(argumentsForTest)(
  'should work for all',
  (a, b, c) => {
    const actual = genDiff(a, b);
    const expected = fs.readFileSync(c, 'utf-8');
    expect(actual).toBe(expected);
  },
);
