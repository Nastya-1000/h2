import _ from 'lodash';

const addValue = value => (_.isObject(value) ? '[complex value]' : value);

const makeStr = (obj, path, action) => `Property '${path}${obj.key}' was ${action}`;

const actByType = {
  unchanged: () => 'not changed.',
  changed: (prop, value1, value2) => `updated. From ${addValue(prop[value1])} to ${addValue(prop[value2])}.`,
  deleted: () => 'removed.',
  added: (prop, value) => `added with value: ${addValue(prop[value])}.`,
};

const strByType = {
  nested: (obj, path, f) => f(obj.children, `${path}${obj.key}.`),
  unchanged: (obj, path) => makeStr(obj, path, actByType[obj.type]()),
  changed: (obj, path) => makeStr(obj, path, actByType[obj.type](obj, 'value1', 'value2')),
  deleted: (obj, path) => makeStr(obj, path, actByType[obj.type]()),
  added: (obj, path) => makeStr(obj, path, actByType[obj.type](obj, 'value')),
};

const render = (ast, path = '') => ast.map(obj => strByType[obj.type](obj, path, render)).join('\n');

export default render;
