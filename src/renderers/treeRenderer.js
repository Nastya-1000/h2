import _ from 'lodash';

const addValue = (value, depth) => (_.isObject(value) ? `{\n${Object.keys(value).map(key => `${' '.repeat(depth + 4)}   ${key}: ${value[key]}`).join('\n')}\n${' '.repeat(depth + 2)} }` : value);

const makeStr = (key, obj, depth, sign, value) => `${' '.repeat(depth)} ${sign} ${key}: ${addValue(obj[key][value], depth)}`;

const strByType = {
  nested: (key, obj, depth, f) => [`${' '.repeat(depth)}   ${key}: {\n${f(obj[key].children, depth + 4)}\n${' '.repeat(depth + 2)} }`],
  unchanged: (key, obj, depth) => [makeStr(key, obj, depth, ' ', 'value')],
  changed: (key, obj, depth) => [makeStr(key, obj, depth, '-', 'value1'), makeStr(key, obj, depth, '+', 'value2')],
  deleted: (key, obj, depth) => [makeStr(key, obj, depth, '-', 'value')],
  added: (key, obj, depth) => [makeStr(key, obj, depth, '+', 'value')],
};

const render = (ast, depth = 1) => {
  const keys = Object.keys(ast);
  const resultArr = keys.reduce((acc, key) => [...acc, ...strByType[ast[key].type](key, ast, depth, render)], []);
  return resultArr.map(str => str).join('\n');
};

export default ast => `{\n${render(ast)}\n}`;
