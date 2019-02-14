import { has, union } from 'lodash';
import fs from 'fs';
import path from 'path';
import parser from './parsers';

const absFilepath = filepath => path.resolve(process.cwd(), filepath);

const genDiff = (pathToFile1, pathToFile2) => {
  const absPathToFile1 = absFilepath(pathToFile1);
  const absPathToFile2 = absFilepath(pathToFile2);
  const format1 = path.extname(absPathToFile1);
  const format2 = path.extname(absPathToFile2);
  if (format1 !== format2) {
    if ((format1 !== '.yml' || format1 !== '.yaml') && (format2 !== '.yml' || format2 !== '.yaml')) {
      return 'Files have different formats';
    }
  }
  const objFromFile1 = parser(fs.readFileSync(absPathToFile1), format1);
  const objFromFile2 = parser(fs.readFileSync(absPathToFile2), format2);
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
