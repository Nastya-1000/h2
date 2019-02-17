import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const extensionsOfArgs = [['.json', '.json'], ['.yaml', '.yml'], ['.ini', '.ini']];
const dirpath = '__tests__/__fixtures__';
const dirnames = ['plain', 'nested'];
const formats = ['tree', 'plain', 'json'];

const makeFilepath = (pathToDir, dirname, name, extension) => path.join(pathToDir, dirname, `${name}${extension}`);

const getArgs = (dirname, format) => extensionsOfArgs.map((extension) => {
  const pathToFile1 = makeFilepath(dirpath, dirname, 'before', extension[0]);
  const pathToFile2 = makeFilepath(dirpath, dirname, 'after', extension[1]);
  const pathToResult = makeFilepath(dirpath, dirname, `${format}Result`, '.txt');
  return [pathToFile1, pathToFile2, format, pathToResult];
});

const argumentsForTest = () => formats.reduce((acc1, format) => [...acc1, ...dirnames.reduce((acc2, name) => [...acc2, ...getArgs(name, format)], [])], []);

test.each(argumentsForTest())(
  'should work for all',
  (a, b, c, d) => {
    const actual = genDiff(a, b, c);
    const expected = fs.readFileSync(d, 'utf-8');
    expect(actual).toBe(expected);
  },
);
