import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import parse from './parsers';
import render from './renderers';

const absFilepath = filepath => path.resolve(process.cwd(), filepath);

const getObjFromFile = (filepath) => {
  const absPathToFile = absFilepath(filepath);
  const extensionOfFile = path.extname(absPathToFile);
  const objFromFile = parse(fs.readFileSync(absPathToFile, 'utf-8'), extensionOfFile);
  return objFromFile;
};

const hasBoth = (obj1, obj2, key) => _.has(obj1, key) && _.has(obj2, key);

const typeVal = [
  {
    type: 'nested',
    check: (key, obj1, obj2) => _.isObject(obj1[key]) && _.isObject(obj2[key]),
    process: (key, obj1, obj2, f) => ({ children: f(obj1[key], obj2[key]) }),
  },
  {
    type: 'unchanged',
    check: (key, obj1, obj2) => hasBoth(obj1, obj2, key) && obj1[key] === obj2[key],
    process: (key, obj1) => ({ value: obj1[key] }),
  },
  {
    type: 'changed',
    check: (key, obj1, obj2) => hasBoth(obj1, obj2, key) && obj1[key] !== obj2[key],
    process: (key, obj1, obj2) => ({ value1: obj1[key], value2: obj2[key] }),
  },
  {
    type: 'deleted',
    check: (key, obj1) => _.has(obj1, key),
    process: (key, obj1) => ({ value: obj1[key] }),
  },
  {
    type: 'added',
    check: (key, obj1, obj2) => _.has(obj2, key),
    process: (key, obj1, obj2) => ({ value: obj2[key] }),
  },
];

const getTypeVal = (obj1, obj2, key) => typeVal.find(({ check }) => check(key, obj1, obj2));

const genAST = (obj1, obj2) => {
  const keys = _.union(Object.keys(obj1), Object.keys(obj2));
  return keys.reduce((acc, key) => {
    const { type, process } = getTypeVal(obj1, obj2, key);
    return { ...acc, [key]: { type, ...process(key, obj1, obj2, genAST) } };
  }, {});
};

const genDiff = (pathToFile1, pathToFile2, format) => {
  const objFromFile1 = getObjFromFile(pathToFile1);
  const objFromFile2 = getObjFromFile(pathToFile2);
  const ast = genAST(objFromFile1, objFromFile2);
  return render(ast, format);
  // return `{\n${render(ast, format)}\n}`;
};

export default genDiff;
