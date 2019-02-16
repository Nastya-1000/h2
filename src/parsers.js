import yaml from 'js-yaml';
import ini from 'ini';

const parsers = {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
  '.yaml': yaml.safeLoad,
  '.ini': ini.decode,
};

export default (fileContent, fileExtension) => parsers[fileExtension](fileContent);
