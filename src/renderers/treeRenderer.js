import _ from 'lodash';

const addValue = (value, depth) => (_.isObject(value) ? `{\n${Object.keys(value).map(key => `${' '.repeat(depth + 4)}   ${key}: ${value[key]}`).join('\n')}\n${' '.repeat(depth + 2)} }` : value);

const makeStr = (obj, depth, sign, value) => `${' '.repeat(depth)} ${sign} ${obj.key}: ${addValue(obj[value], depth)}`;

const strByType = {
  nested: (obj, depth, f) => `${' '.repeat(depth)}   ${obj.key}: {\n${f(obj.children, depth + 4)}\n${' '.repeat(depth + 2)} }`,
  unchanged: (obj, depth) => makeStr(obj, depth, ' ', 'value'),
  changed: (obj, depth) => [makeStr(obj, depth, '-', 'value1'), makeStr(obj, depth, '+', 'value2')],
  deleted: (obj, depth) => makeStr(obj, depth, '-', 'value'),
  added: (obj, depth) => makeStr(obj, depth, '+', 'value'),
};

const render = (ast, depth = 1) => _.flatten(ast.map(obj => strByType[obj.type](obj, depth, render))).join('\n');

export default ast => `{\n${render(ast)}\n}`;
