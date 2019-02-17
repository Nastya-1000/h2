const addValue = (key, value) => ((typeof value === 'number' || typeof value === 'boolean') ? value.toString() : value);

export default ast => JSON.stringify(ast, addValue, 4);
