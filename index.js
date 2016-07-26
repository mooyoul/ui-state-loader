'use strict';

var
  program = require('ast-query');

module.exports = function(source) {
  this.cacheable();

  var
    tree        = program(source),
    stateNodes  = tree.callExpression('$stateProvider.state')
      .filter(function(node) {
        return node.arguments && node.arguments.length > 1 &&
        node.arguments[0].type === 'Literal' &&
        node.arguments[1].type === 'ObjectExpression';
      });

  return 'module.exports = exports = ' + JSON.stringify(stateNodes.nodes.map(function(node) {
    return node.arguments[1].properties.reduce(function(hash, v) {
      if (v.value.type !== 'CallExpression') {
        hash[v.key.name] = v.value.value;
      }
      return hash;
    }, {
      name: node.arguments[0].value
    });
  }));
};

