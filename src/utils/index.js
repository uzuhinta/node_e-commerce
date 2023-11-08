const _ = require('lodash');

const getInfoData = (field = [], object = {}) => _.pick(object, field);

const getSelectData = (select) => Object.fromEntries(select.map((val) => [val, 1]));

const getUnselectData = (select) => Object.fromEntries(select.map((val) => [val, 0]));

const removeUndefinedObjectParser = (obj) => {
  const result = {};

  Object.keys(obj).forEach((k) => {
    if (!(obj[k] === null || obj[k] === undefined)) {
      result[k] = obj[k];
    }
  });

  return result;
};

const updateNestedObjectParser = (obj) => {
  const result = {};

  Object.keys(obj).map((key) => {
    if (obj[key] === null || obj[key] === undefined) {
      return;
    } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      const res = updateNestedObjectParser(obj[key]);
      Object.keys(res).forEach((k) => (result[`${key}.${k}`] = res[k]));
    } else {
      result[key] = obj[key];
    }
  });

  return result;
};

module.exports = {
  getInfoData,
  getSelectData,
  getUnselectData,
  removeUndefinedObjectParser,
  updateNestedObjectParser,
};
