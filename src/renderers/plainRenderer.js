import _ from 'lodash';

const addValue = value => (_.isObject(value) ? '[complex value]' : value);

const makeStr = (key, obj, path, action) => `Property '${path}${key}' was ${action}`;

const actByType = {
  changed: (prop, value1, value2) => `updated. From ${addValue(prop[value1])} to ${addValue(prop[value2])}.`,
  deleted: () => 'removed.',
  added: (prop, value) => `added with value: ${addValue(prop[value])}.`,
};

const strByType = {
  nested: (key, obj, path, f) => [f(obj[key].children, `${path}${key}.`)],
  unchanged: () => [],
  changed: (key, obj, path) => [makeStr(key, obj, path, actByType[obj[key].type](obj[key], 'value1', 'value2'))],
  deleted: (key, obj, path) => [makeStr(key, obj, path, actByType[obj[key].type]())],
  added: (key, obj, path) => [makeStr(key, obj, path, actByType[obj[key].type](obj[key], 'value'))],
};

const render = (ast, path = '') => {
  const keys = Object.keys(ast);
  const resultArr = keys.reduce((acc, key) => [...acc, ...strByType[ast[key].type](key, ast, path, render)], []);
  return resultArr.map(str => str).join('\n');
};

export default render;
