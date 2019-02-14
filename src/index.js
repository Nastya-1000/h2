import { has, union } from 'lodash';
import fs from 'fs';
import path from 'path';
import parser from './parsers';

const absFilepath = filepath => path.resolve(process.cwd(), filepath);

const getObjFromFile = (filepath) => {
  const absPathToFile = absFilepath(filepath);
  const extensionOfFile = path.extname(absPathToFile);
  const objFromFile = parser(fs.readFileSync(absPathToFile, 'utf-8'), extensionOfFile);
  return [objFromFile, extensionOfFile];
};

const genDiff = (pathToFile1, pathToFile2) => {
  const [objFromFile1, extensionOfFile1] = getObjFromFile(pathToFile1);
  const [objFromFile2, extensionOfFile2] = getObjFromFile(pathToFile2);
  if (extensionOfFile1 !== extensionOfFile2) {
    if ((extensionOfFile1 !== '.yml' && extensionOfFile1 !== '.yaml') || (extensionOfFile2 !== '.yml' && extensionOfFile2 !== '.yaml')) {
      return 'Files have different formats';
    }
  }
  const keys = union(Object.keys(objFromFile1), Object.keys(objFromFile2));
  const resultArr = keys.reduce((acc, key) => {
    if (has(objFromFile1, key) && has(objFromFile2, key)) {
      if (objFromFile1[key] === objFromFile2[key]) {
        return [...acc, `   ${key}: ${objFromFile1[key]}`];
      }
      return [...acc, ` - ${key}: ${objFromFile1[key]}`, ` + ${key}: ${objFromFile2[key]}`];
    }
    if (has(objFromFile1, key)) {
      return [...acc, ` - ${key}: ${objFromFile1[key]}`];
    }
    return [...acc, ` + ${key}: ${objFromFile2[key]}`];
  }, []);

  const result = resultArr.map(str => str).join('\n');
  return `{\n${result}\n}`;
};

export default genDiff;
