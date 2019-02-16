import treeRenderer from './treeRenderer';
import plainRenderer from './plainRenderer';

const renderers = {
  tree: treeRenderer,
  plain: plainRenderer,
};

export default (ast, format) => renderers[format](ast);
