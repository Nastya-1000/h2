import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import parse from './parsers';

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
    check: (obj1, obj2, key) => _.isObject(obj1[key]) && _.isObject(obj2[key]),
    process: (obj1, obj2, key, f) => ({ children: f(obj1[key], obj2[key]) }),
  },
  {
    type: 'unchanged',
    check: (obj1, obj2, key) => hasBoth(obj1, obj2, key) && obj1[key] === obj2[key],
    process: (obj1, obj2, key) => ({ value: obj1[key] }),
  },
  {
    type: 'changed',
    check: (obj1, obj2, key) => hasBoth(obj1, obj2, key) && obj1[key] !== obj2[key],
    process: (obj1, obj2, key) => ({ value1: obj1[key], value2: obj2[key] }),
  },
  {
    type: 'deleted',
    check: (obj1, obj2, key) => _.has(obj1, key),
    process: (obj1, obj2, key) => ({ value: obj1[key] }),
  },
  {
    type: 'added',
    check: (obj1, obj2, key) => _.has(obj2, key),
    process: (obj1, obj2, key) => ({ value: obj2[key] }),
  },
];

const getTypeVal = (obj1, obj2, key) => typeVal.find(({ check }) => check(obj1, obj2, key));

const genAST = (obj1, obj2) => {
  const keys = _.union(Object.keys(obj1), Object.keys(obj2));
  return keys.reduce((acc, key) => {
    const { type, process } = getTypeVal(obj1, obj2, key);
    return { ...acc, [key]: { type, ...process(obj1, obj2, key, genAST) } };
  }, {});
};


const addValue = (value, depth) => (_.isObject(value) ? `{\n${Object.keys(value).map(key => `${' '.repeat(depth + 4)}   ${key}: ${value[key]}`).join('\n')}\n${' '.repeat(depth + 2)} }` : value);

const strTemplate = (key, obj, depth, sign, value) => `${' '.repeat(depth)} ${sign} ${key}: ${addValue(obj[key][value], depth)}`;

const strByType = {
  nested: (key, obj, depth, f) => [`${' '.repeat(depth)}   ${key}: {\n${f(obj[key].children, depth + 4)}\n${' '.repeat(depth + 2)} }`],
  unchanged: (key, obj, depth) => [strTemplate(key, obj, depth, ' ', 'value')],
  changed: (key, obj, depth) => [strTemplate(key, obj, depth, '-', 'value1'), strTemplate(key, obj, depth, '+', 'value2')],
  deleted: (key, obj, depth) => [strTemplate(key, obj, depth, '-', 'value')],
  added: (key, obj, depth) => [strTemplate(key, obj, depth, '+', 'value')],
};

const render = (ast, depth = 1) => {
  const keys = Object.keys(ast);
  const resultArr = keys.reduce((acc, key) => [...acc, ...strByType[ast[key].type](key, ast, depth, render)], []);
  return resultArr.map(str => str).join('\n');
};


const genDiff = (pathToFile1, pathToFile2) => {
  const objFromFile1 = getObjFromFile(pathToFile1);
  const objFromFile2 = getObjFromFile(pathToFile2);
  const ast = genAST(objFromFile1, objFromFile2);
  return `{\n${render(ast)}\n}`;
};

export default genDiff;
