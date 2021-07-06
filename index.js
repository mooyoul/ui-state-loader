'use strict';

var loaderUtils = require('loader-utils'),
  acorn = require('acorn'),
  traverse = require('traverse');

module.exports = function (source) {
  var query = loaderUtils.parseQuery(this.query),
    configKey = query.config || 'uiStateLoader',
    config = {
      select: [],
      providerName: '$stateProvider',
    },
    tree = acorn.parse(source, { sourceType: 'module' }),
    stateNodes,
    _options;

  this.cacheable && this.cacheable();

  Object.keys(query).forEach(function (attr) {
    config[attr] = query[attr];
  });

  _options = this.options[configKey];

  if (_options) {
    Object.keys(_options).forEach(function (attr) {
      config[attr] = _options[attr];
    });
  }

  if (typeof config.select === 'string') {
    config.select = config.select.split(/[, ]/g);
  }

  stateNodes = traverse(tree)
    .nodes()
    .filter(function (node) {
      return (
        node &&
        node.type === 'CallExpression' &&
        node.callee &&
        node.callee.property &&
        node.callee.property.name === 'state' &&
        hasValidCallee(node, config.providerName) &&
        node.arguments &&
        node.arguments[1]
      );
    });

  return (
    'module.exports = exports = ' +
    JSON.stringify(
      stateNodes.map(function (node) {
        return node.arguments[1].properties.reduce(
          function (hash, prop) {
            if (prop.value.type !== 'CallExpression') {
              hash[prop.key.name] = prop.value.value;
            }

            return hash;
          },
          { name: node.arguments[0].value }
        );
      })
    )
  );
};

function hasValidCallee(node, providerName) {
  if (node.callee) {
    return hasValidCallee(node.callee, providerName);
  }

  if (node.object && node.object.callee) {
    return hasValidCallee(node.object.callee, providerName);
  }

  return (
    node.object &&
    node.object.type === 'Identifier' &&
    node.object.name === providerName
  );
}
