import { has, union } from 'lodash';
import fs from 'fs';
import path from 'path';

const absFilepath = filepath => path.resolve(process.cwd(), filepath);

const genDiff = (pathToFile1, pathToFile2) => {
  const objFromFile1 = JSON.parse(fs.readFileSync(absFilepath(pathToFile1)));
  const objFromFile2 = JSON.parse(fs.readFileSync(absFilepath(pathToFile2)));
  const keys = union(Object.keys(objFromFile1), Object.keys(objFromFile2));
  const result = keys.reduce((acc, key) => {
    if (has(objFromFile1, key) && has(objFromFile2, key)) {
      if (objFromFile1[key] === objFromFile2[key]) {
        return `${acc}\n   ${key}: ${objFromFile1[key]}`;
      }
      return `${acc}\n - ${key}: ${objFromFile1[key]}\n + ${key}: ${objFromFile2[key]}`;
    }
    if (has(objFromFile1, key)) {
      return `${acc}\n - ${key}: ${objFromFile1[key]}`;
    }
    return `${acc}\n + ${key}: ${objFromFile2[key]}`;
  }, '');
  return `{${result}\n}`;
};

export default genDiff;
